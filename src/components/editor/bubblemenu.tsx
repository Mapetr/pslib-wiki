import { Editor } from "@tiptap/core";
import {
  LucideBold,
  LucideCode,
  LucideItalic,
  LucideStrikethrough,
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle.tsx";

function BubbleMenuButton({
  editor,
  name,
  children,
  onClick,
}: {
  editor: Editor;
  name: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Toggle
      onPressedChange={() => onClick()}
      pressed={editor.isActive(name)}
      className={"h-5 w-5"}
    >
      {children}
    </Toggle>
  );
}

export function BubbleMenuView({ editor }: { editor: Editor | null }) {
  if (!editor) return;

  return (
    <div className="flex rounded-md bg-black p-1 outline outline-gray-400">
      <BubbleMenuButton
        editor={editor}
        name={"bold"}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <LucideBold />
      </BubbleMenuButton>
      <BubbleMenuButton
        editor={editor}
        name={"italic"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <LucideItalic />
      </BubbleMenuButton>
      <BubbleMenuButton
        editor={editor}
        name={"strike"}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <LucideStrikethrough />
      </BubbleMenuButton>
      <BubbleMenuButton
        editor={editor}
        name={"code"}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <LucideCode />
      </BubbleMenuButton>
    </div>
  );
}
