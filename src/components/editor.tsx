import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "../../convex/_generated/api";
import { EditorProvider } from "@tiptap/react";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import "katex/dist/katex.min.css";
import EditorInside from "@/components/editor/editor-inside.tsx";
import { EditorExtensions } from "@/components/editor/editor.ts";

export function Editor(props: { id: string }) {
  const { isSignedIn, isLoaded } = useUser();
  const sync = useTiptapSync(api.prosemirror, props.id);

  if (sync.isLoading || (!isLoaded && sync.initialContent === null)) {
    return <Loader2 className={"animate-spin"} />;
  }

  if (!sync.isLoading && sync.initialContent === null) {
    sync.create({ type: "doc", content: [] }).catch((err) => {
      console.error("failed to create doc in sync", err);
    });
    return;
  }

  return (
    <EditorProvider
      content={sync.initialContent}
      editable={isSignedIn}
      extensions={[...EditorExtensions, sync.extension]}
      editorProps={{
        attributes: {
          class:
            "prose prose-base prose-zinc dark:prose-invert px-2 mx-auto min-h-screen border-l border-r border-dotted focus:outline-none",
        },
      }}
    >
      <EditorInside />
    </EditorProvider>
  );
}
