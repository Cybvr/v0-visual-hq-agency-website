"use client"

import { useEffect } from "react"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
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
    { label: "Undo", icon: Undo2, run: (editor) => editor.chain().focus().undo().run() },
    { label: "Redo", icon: Redo2, run: (editor) => editor.chain().focus().redo().run() },
  ],
]

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    // Next renders this on the server first, and tiptap needs the DOM.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-64 px-4 py-3 text-sm outline-none",
          "[&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-2 [&_p]:leading-7 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:border-border",
        ),
        ...(placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  })

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
    <div className={cn("overflow-hidden rounded-[10px] border border-input bg-background", className)}>
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
      <EditorContent editor={editor} />
    </div>
  )
}
