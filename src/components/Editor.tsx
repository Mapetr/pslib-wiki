import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "../../convex/_generated/api";
import { EditorContent, EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

export function Editor(props: { id: string }) {
  const sync = useTiptapSync(api.prosemirror, props.id);
  return (
    sync.isLoading ? <p>Loading</p>
    : sync.initialContent !== null ?
      <EditorProvider
        content={sync.initialContent}
        extensions={[StarterKit, sync.extension]}
      >
        <EditorContent editor={null} />
      </EditorProvider>
    : <button onClick={() => sync.create({ type: "doc", content: [] })}>
        Create document
      </button>
  );
}
