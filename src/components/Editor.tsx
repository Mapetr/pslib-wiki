import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "../../convex/_generated/api";
import { EditorContent, EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";

export function Editor(props: { id: string }) {
  const sync = useTiptapSync(api.prosemirror, props.id);

  if (!sync.isLoading && sync.initialContent === null) {
    sync.create({ type: "doc", content: [] }).catch((err) => {
      console.error("failed to create doc in sync", err);
    });
  }

  return sync.isLoading || sync.initialContent === null ?
      <p>Loading</p>
    : <EditorProvider
        content={sync.initialContent}
        extensions={[StarterKit, sync.extension]}
        editorProps={{
          attributes: {
            class:
              "prose prose-sm dark:prose-invert sm:prose-base m-5 focus:outline-none",
          },
        }}
      >
        <EditorContent editor={null} />
      </EditorProvider>;
}
