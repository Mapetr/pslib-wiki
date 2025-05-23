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
import { FileHandler } from "@tiptap-pro/extension-file-handler";
import { createSuggestionsItems } from "@harshtalks/slash-tiptap";
import { Image } from "@tiptap/extension-image";
import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "../../../convex/_generated/api";

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
