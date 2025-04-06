import CodeBlockShiki from "tiptap-extension-code-block-shiki";
import { Blockquote } from "@tiptap/extension-blockquote";
import { BulletList } from "@tiptap/extension-bullet-list";
import { Document } from "@tiptap/extension-document";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Heading } from "@tiptap/extension-heading";
import { HorizontalRule } from "@tiptap/extension-horizontal-rule";
import { ListItem } from "@tiptap/extension-list-item";
import { OrderedList } from "@tiptap/extension-ordered-list";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Bold } from "@tiptap/extension-bold";
import { Code } from "@tiptap/extension-code";
import { Italic } from "@tiptap/extension-italic";
import { Link } from "@tiptap/extension-link";
import { Strike } from "@tiptap/extension-strike";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { Gapcursor } from "@tiptap/extension-gapcursor";
import { History } from "@tiptap/extension-history";
import { Highlight } from "@tiptap/extension-highlight";
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Mathematics } from "@tiptap-pro/extension-mathematics";
import { createSuggestionsItems } from "@harshtalks/slash-tiptap";
import { Image } from "@tiptap/extension-image";

export const EditorSuggestions = createSuggestionsItems([
  {
    title: "Heading 1",
    searchTerms: ["heading", "h1"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    searchTerms: ["heading", "h2"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    searchTerms: ["heading", "h3"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Heading 4",
    searchTerms: ["heading", "h4"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 4 }).run();
    },
  },
  {
    title: "Heading 5",
    searchTerms: ["heading", "h5"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 5 }).run();
    },
  },
  {
    title: "Code block",
    searchTerms: ["code", "block"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: "Bullet List",
    searchTerms: ["unordered", "point"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Ordered List",
    searchTerms: ["ordered", "point", "numbers"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
]);

export const EditorExtensions = [
  Blockquote,
  BulletList,
  CodeBlockShiki.configure({
    defaultTheme: "tokyo-night",
  }),
  Document,
  // FileHandler.configure({
  //   allowedMimeTypes: [
  //     "image/png",
  //     "image/jpeg",
  //     "image/gif",
  //     "image/webp"
  //   ],
  //   onDrop: async (currentEditor, files, pos) => {
  //     if (!isSignedIn) return;
  //
  //     for (const file of files) {
  //       const url = await uploadFileToS3(file.size, file.type);
  //       if (!url) return;
  //
  //       await fetch(url.url, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": file.type
  //         }
  //       });
  //       const finalUrl = new URL(url.url);
  //
  //       // Insert the uploaded image into the editor
  //       currentEditor
  //         .chain()
  //         .insertContentAt(pos, {
  //           type: "image",
  //           attrs: {
  //             src: `${process.env.NEXT_PUBLIC_S3_DESTIONATION_URL}/${finalUrl.pathname}`
  //           }
  //         })
  //         .focus()
  //         .run();
  //     }
  //   },
  //   onPaste: async (currentEditor, files, htmlContent) => {
  //     if (!isSignedIn) return;
  //
  //     if (htmlContent) {
  //       return false;
  //     }
  //
  //     for (const file of files) {
  //       const url = await uploadFileToS3(file.size, file.type);
  //       if (!url) return;
  //
  //       await fetch(url.url, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": file.type
  //         },
  //         body: file
  //       });
  //       const finalUrl = new URL(url.url);
  //
  //       // Insert the uploaded image into the editor
  //       currentEditor
  //         .chain()
  //         .insertContentAt(currentEditor.state.selection.anchor, {
  //           type: "image",
  //           attrs: {
  //             src: `${process.env.NEXT_PUBLIC_S3_DESTINATION_URL}${finalUrl.pathname}`
  //           }
  //         })
  //         .focus()
  //         .run();
  //     }
  //   }
  // }),
  HardBreak,
  Heading.configure({ levels: [1, 2, 3, 4, 5] }),
  HorizontalRule,
  Image,
  ListItem,
  Mathematics,
  OrderedList,
  Paragraph,
  Placeholder.configure({
    placeholder: "Press / to see available commands",
    emptyEditorClass: "is-editor-empty text-gray-500",
  }),
  // Slash.configure({
  //   suggestion: {
  //     items: () => EditorSuggestions
  //   }
  // }),
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
