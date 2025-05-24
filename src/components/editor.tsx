import { useTiptapSync } from "@convex-dev/prosemirror-sync/tiptap";
import { api } from "../../convex/_generated/api";
import { EditorProvider } from "@tiptap/react";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import "katex/dist/katex.min.css";
import EditorInside from "@/components/editor/editor-inside.tsx";
import { Blockquote } from "@tiptap/extension-blockquote";
import { BulletList } from "@tiptap/extension-bullet-list";
import CodeBlockShiki from "tiptap-extension-code-block-shiki";
import { Document } from "@tiptap/extension-document";
import { FileHandler } from "@tiptap-pro/extension-file-handler";
import { useUploadFile } from "@convex-dev/r2/react";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { ListItem } from "@tiptap/extension-list-item";
import { Mathematics } from "@tiptap-pro/extension-mathematics";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Code } from "@tiptap/extension-code";
import { Highlight } from "@tiptap/extension-highlight";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { Strike } from "@tiptap/extension-strike";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { History } from "@tiptap/extension-history";
import { ImageResize } from "tiptap-extension-resize-image";
import {
  baseSpotlightManager,
  Spotlight,
  SpotlightBlockSection,
  SpotlightTextSection,
} from "@webkadiz/tiptap-extension-spotlight/commonjs";

export function Editor(props: { id: string }) {
  const { isSignedIn, isLoaded } = useUser();
  const uploadFile = useUploadFile(api.r2);
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

  const EditorExtensions = [
    Blockquote,
    BulletList,
    CodeBlockShiki.configure({
      defaultTheme: "tokyo-night",
    }),
    Document,
    FileHandler.configure({
      allowedMimeTypes: [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
        "image/avif",
      ],
      onDrop: async (currentEditor, files, pos) => {
        if (!isSignedIn) return;

        for (const file of files) {
          const key = await uploadFile(file);

          // Insert the uploaded image into the editor
          currentEditor
            .chain()
            .insertContentAt(pos, {
              type: "image",
              attrs: {
                src: `${process.env.VITE_DESTINATION_UPLOAD}/${key}`,
              },
            })
            .focus()
            .run();
        }
      },
      onPaste: async (currentEditor, files, htmlContent) => {
        if (!isSignedIn) return;

        if (htmlContent) {
          return false;
        }

        for (const file of files) {
          const key = await uploadFile(file);

          // Insert the uploaded image into the editor
          currentEditor
            .chain()
            .insertContentAt(currentEditor.state.selection.anchor, {
              type: "image",
              attrs: {
                src: `${import.meta.env.VITE_DESTINATION_UPLOAD}/${key}`,
              },
            })
            .focus()
            .run();
        }
      },
    }),
    HardBreak,
    Heading.configure({ levels: [1, 2, 3, 4, 5] }),
    HorizontalRule,
    ImageResize,
    ListItem,
    Mathematics,
    OrderedList,
    Paragraph,
    Placeholder.configure({
      placeholder: "Press / to see available commands",
      emptyEditorClass: "is-editor-empty text-gray-500",
    }),

    Spotlight.configure(),
    SpotlightBlockSection.removeItem("table"),
    SpotlightTextSection.removeItem("underline"),
    baseSpotlightManager.removeSection("align"),

    Text,

    Bold,
    Code,
    Highlight,
    Italic,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
      // isAllowedUri: (url: string, ctx: Lonk) => {
      //   try {
      //     // construct URL
      //     const parsedUrl =
      //       url.includes(":") ?
      //         new URL(url)
      //       : new URL(`${ctx.defaultProtocol}://${url}`);
      //
      //     // use default validation
      //     if (!ctx.defaultValidate(parsedUrl.href)) {
      //       return false;
      //     }
      //
      //     // disallowed protocols
      //     const disallowedProtocols = ["ftp", "file", "mailto"];
      //     const protocol = parsedUrl.protocol.replace(":", "");
      //
      //     if (disallowedProtocols.includes(protocol)) {
      //       return false;
      //     }
      //
      //     // only allow protocols specified in ctx.protocols
      //     const allowedProtocols = ctx.protocols.map((p) =>
      //       typeof p === "string" ? p : p.scheme,
      //     );
      //
      //     if (!allowedProtocols.includes(protocol)) {
      //       return false;
      //     }
      //
      //     // all checks have passed
      //     return true;
      //   } catch {
      //     return false;
      //   }
      // },
      shouldAutoLink: (url: string) => {
        try {
          const parsedUrl =
            url.includes(":") ? new URL(url) : new URL(`https://${url}`);

          return parsedUrl.protocol === "https:";
        } catch {
          return false;
        }
      },
    }),
    Strike,

    BubbleMenu,
    Dropcursor,
    Gapcursor,
    History,
  ];

  return (
    <EditorProvider
      content={sync.initialContent}
      editable={isSignedIn}
      extensions={[...EditorExtensions, sync.extension]}
      editorProps={{
        attributes: {
          class:
            "prose prose-base prose-zinc dark:prose-invert px-2 h-full mx-auto mb-64 focus:outline-none print:[&_*]:text-black",
        },
      }}
      editorContainerProps={{ className: "h-full" }}
    >
      <h1>{}</h1>
      <EditorInside />
    </EditorProvider>
  );
}
