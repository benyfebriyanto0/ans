"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Quote, Redo, Undo, Pilcrow } from "lucide-react";
import { cn } from "@/lib/utils";

export function RichTextEditor({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (html: string) => void;
  id?: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } })],
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: "tiptap text-sm", ...(id ? { id } : {}) } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const btn = (active: boolean, onClick: () => void, label: string, Icon: React.ElementType) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground",
        active && "bg-secondary text-primary",
      )}
    >
      <Icon className="size-4" />
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-card focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30">
      <div className="flex flex-wrap gap-0.5 border-b bg-muted/40 p-1">
        {editor && (
          <>
            {btn(editor.isActive("paragraph"), () => editor.chain().focus().setParagraph().run(), "Paragraf", Pilcrow)}
            {btn(
              editor.isActive("heading", { level: 2 }),
              () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
              "Judul",
              Heading2,
            )}
            {btn(
              editor.isActive("heading", { level: 3 }),
              () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
              "Subjudul",
              Heading3,
            )}
            {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "Tebal", Bold)}
            {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "Miring", Italic)}
            {btn(
              editor.isActive("bulletList"),
              () => editor.chain().focus().toggleBulletList().run(),
              "Daftar poin",
              List,
            )}
            {btn(
              editor.isActive("orderedList"),
              () => editor.chain().focus().toggleOrderedList().run(),
              "Daftar nomor",
              ListOrdered,
            )}
            {btn(
              editor.isActive("blockquote"),
              () => editor.chain().focus().toggleBlockquote().run(),
              "Kutipan",
              Quote,
            )}
            <span className="mx-1 w-px bg-border" />
            {btn(false, () => editor.chain().focus().undo().run(), "Undo", Undo)}
            {btn(false, () => editor.chain().focus().redo().run(), "Redo", Redo)}
          </>
        )}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
