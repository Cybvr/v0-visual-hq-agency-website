/**
 * A small Markdown to HTML pass, enough to bring pasted or imported notes into
 * the editor as formatted content. It covers headings, lists, blockquotes, code
 * fences, tables, rules and paragraphs; anything fancier the writer tidies up in
 * the editor. It is not a full CommonMark parser and does not try to be.
 */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/** Inline emphasis, code, and links, run over already-escaped text. */
function inlineMarkdown(text: string) {
  return text
    .replace(/`([^`]+)`/g, (_match, code) => `<code>${code}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/(^|[^_])_([^_]+)_/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2">$1</a>')
}

/** Split "| a | b |" into ["a", "b"], tolerating the optional outer pipes. */
function tableCells(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/.test(line)
}

/** True when the text carries any Markdown worth converting, so plain prose is left alone. */
export function looksLikeMarkdown(text: string) {
  return (
    /^#{1,6}\s/m.test(text) ||
    /^\s*[-*+]\s+/m.test(text) ||
    /^\s*\d+[.)]\s+/m.test(text) ||
    /^\s*>\s+/m.test(text) ||
    /^```/m.test(text) ||
    /^\s*\|.+\|\s*$/m.test(text) ||
    /\*\*[^*]+\*\*/.test(text) ||
    /`[^`]+`/.test(text) ||
    /\[[^\]]+\]\(https?:[^)\s]+\)/.test(text)
  )
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n")
  const html: string[] = []
  let listType: "ul" | "ol" | null = null
  let inCode = false
  let codeBuffer: string[] = []
  let paragraph: string[] = []

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    html.push(`<p>${inlineMarkdown(escapeHtml(paragraph.join(" ")))}</p>`)
    paragraph = []
  }
  const closeList = () => {
    if (listType) { html.push(`</${listType}>`); listType = null }
  }

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index]
    const line = raw.replace(/\s+$/, "")

    if (line.trim().startsWith("```")) {
      if (inCode) { html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`); codeBuffer = []; inCode = false }
      else { flushParagraph(); closeList(); inCode = true }
      continue
    }
    if (inCode) { codeBuffer.push(raw); continue }

    if (line.trim() === "") { flushParagraph(); closeList(); continue }

    // A pipe table: a header row, a dashed separator, then the body rows.
    if (/^\s*\|.*\|?\s*$/.test(line) && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
      flushParagraph(); closeList()
      const headers = tableCells(line)
      const head = `<thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(escapeHtml(cell))}</th>`).join("")}</tr></thead>`
      const bodyRows: string[] = []
      index += 2
      while (index < lines.length && /\|/.test(lines[index]) && lines[index].trim() !== "") {
        const cells = tableCells(lines[index])
        bodyRows.push(`<tr>${cells.map((cell) => `<td>${inlineMarkdown(escapeHtml(cell))}</td>`).join("")}</tr>`)
        index += 1
      }
      index -= 1
      html.push(`<table>${head}<tbody>${bodyRows.join("")}</tbody></table>`)
      continue
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      flushParagraph(); closeList()
      const level = heading[1].length
      html.push(`<h${level}>${inlineMarkdown(escapeHtml(heading[2].trim()))}</h${level}>`)
      continue
    }

    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { flushParagraph(); closeList(); html.push("<hr>"); continue }

    if (/^\s*>\s?/.test(line)) {
      flushParagraph(); closeList()
      html.push(`<blockquote><p>${inlineMarkdown(escapeHtml(line.replace(/^\s*>\s?/, "")))}</p></blockquote>`)
      continue
    }

    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line)
    const unordered = /^\s*[-*+]\s+(.*)$/.exec(line)
    if (ordered || unordered) {
      flushParagraph()
      const wanted = ordered ? "ol" : "ul"
      if (listType !== wanted) { closeList(); html.push(`<${wanted}>`); listType = wanted }
      html.push(`<li>${inlineMarkdown(escapeHtml((ordered ?? unordered)![1].trim()))}</li>`)
      continue
    }

    paragraph.push(line.trim())
  }

  if (inCode && codeBuffer.length) html.push(`<pre><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`)
  flushParagraph()
  closeList()
  return html.join("\n")
}
