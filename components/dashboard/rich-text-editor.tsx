"use client"

import { useEffect, useRef } from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import { Image } from "@tiptap/extension-image"
import StarterKit from "@tiptap/starter-kit"
import { TableKit } from "@tiptap/extension-table"

import { looksLikeMarkdown, markdownToHtml } from "@/lib/markdown"
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Table as TableIcon,
  Undo2,
} from "lucide-react"

import { cn } from "@/lib/utils"

type ToolbarButton = {
  label: string
  icon: typeof Bold
  isActive?: (editor: Editor) => boolean
  run: (editor: Editor) => void
}

const BUTTONS: ToolbarButton[][] = [
  [
    {
      label: "Bold",
      icon: Bold,
      isActive: (editor) => editor.isActive("bold"),
      run: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: Italic,
      isActive: (editor) => editor.isActive("italic"),
      run: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Strikethrough",
      icon: Strikethrough,
      isActive: (editor) => editor.isActive("strike"),
      run: (editor) => editor.chain().focus().toggleStrike().run(),
    },
  ],
  [
    {
      label: "Heading",
      icon: Heading2,
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
      run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Subheading",
      icon: Heading3,
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
      run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      label: "Bulleted list",
      icon: List,
      isActive: (editor) => editor.isActive("bulletList"),
      run: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      isActive: (editor) => editor.isActive("orderedList"),
      run: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Quote",
      icon: Quote,
      isActive: (editor) => editor.isActive("blockquote"),
      run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
  ],
  [
    {
      label: "Table",
      icon: TableIcon,
      isActive: (editor) => editor.isActive("table"),
      run: (editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
  ],
  [
    { label: "Undo", icon: Undo2, run: (editor) => editor.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, run: (editor) => editor.chain().focus().redo().run() },
  ],
]

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
  scrollable = false,
  compact = false,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  scrollable?: boolean
  compact?: boolean
}) {
  // Referenced inside handlePaste, which runs long after the editor is built.
  const editorRef = useRef<Editor | null>(null)

  const editor = useEditor({
    extensions: [StarterKit, Image, TableKit.configure({ table: { resizable: true } })],
    content: value,
    // Next renders this on the server first, and tiptap needs the DOM.
    immediatelyRender: false,
    editorProps: {
      // Pasted plain text that is really Markdown arrives as literal #, * and |,
      // so format it before it lands. Rich (text/html) pastes are left untouched.
      handlePaste: (_view, event) => {
        const clipboard = event.clipboardData
        if (!clipboard || clipboard.getData("text/html")) return false
        const text = clipboard.getData("text/plain")
        if (!text || !looksLikeMarkdown(text)) return false
        editorRef.current?.chain().focus().insertContent(markdownToHtml(text)).run()
        return true
      },
      attributes: {
        class: cn(
          compact ? "min-h-48 sm:min-h-64" : "min-h-64",
          "break-words px-4 py-3 text-sm outline-none",
          "cursor-text",
          "[&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-2 [&_p]:leading-7 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:border-border",
          "[&_a]:break-all [&_img]:max-w-full [&_table]:my-3 [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_.selectedCell]:bg-muted/60",
        ),
        "aria-label": placeholder || "Message",
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  })

  editorRef.current = editor

  // Content arriving after mount (an edit page finishing its load) has to be
  // pushed in, but only when it differs or the caret jumps on every keystroke.
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false })
  }, [editor, value])

  if (!editor) {
    return <div className={cn("min-h-72 rounded-[10px] border border-input", className)} />
  }

  return (
    <div className={cn("flex min-h-0 flex-col overflow-hidden rounded-[10px] border border-input bg-background", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-input px-2 py-1.5">
        {BUTTONS.map((group, index) => (
          <div key={index} className="flex items-center gap-1 [&:not(:last-child)]:mr-1">
            {group.map((button) => {
              const Icon = button.icon
              const active = button.isActive?.(editor) ?? false
              return (
                <button
                  key={button.label}
                  type="button"
                  onClick={() => button.run(editor)}
                  aria-label={button.label}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <div className={cn("min-h-0 overflow-x-auto", scrollable && "flex-1 overflow-y-auto")}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
