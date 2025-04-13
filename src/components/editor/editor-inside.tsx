import { BubbleMenu, EditorContent, useCurrentEditor } from "@tiptap/react";
import { DragHandle } from "@tiptap-pro/extension-drag-handle-react";
import { BubbleMenuView } from "@/components/editor/bubblemenu.tsx";

export default function EditorInside() {
  const editor = useCurrentEditor();

  if (!editor.editor) return;

  return (
    <div>
      <DragHandle
        className={
          "flex h-6 w-6 items-center justify-center rounded-md border border-gray-700 bg-gray-500"
        }
        editor={editor.editor}
      >
        <svg
          className={"h-4 w-4"}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          />
        </svg>
      </DragHandle>
      <BubbleMenu editor={editor.editor} tippyOptions={{ duration: 100 }}>
        <BubbleMenuView editor={editor.editor} />
      </BubbleMenu>
      <EditorContent editor={null} />
    </div>
  );
}
