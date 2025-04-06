import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "../../convex/_generated/api";
import { EditorContent, EditorProvider } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

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
      extensions={[StarterKit, sync.extension]}
      editorProps={{
        attributes: {
          class:
            "prose prose-sm dark:prose-invert sm:prose-base m-5 focus:outline-none",
        },
      }}
    >
      <EditorContent editor={null} />
    </EditorProvider>
  );
}
