"use client"

import {BubbleMenu as BubbleMenuJsx, EditorContent, useEditor, Editor as EditorType} from "@tiptap/react";
import CodeBlockShiki from "tiptap-extension-code-block-shiki";
import {Blockquote} from "@tiptap/extension-blockquote";
import {BulletList} from "@tiptap/extension-bullet-list";
import {Document} from "@tiptap/extension-document";
import {HardBreak} from "@tiptap/extension-hard-break";
import {Heading} from "@tiptap/extension-heading";
import {HorizontalRule} from "@tiptap/extension-horizontal-rule";
import {ListItem} from "@tiptap/extension-list-item";
import {OrderedList} from "@tiptap/extension-ordered-list";
import {Paragraph} from "@tiptap/extension-paragraph";
import {Text} from "@tiptap/extension-text";
import {Bold} from "@tiptap/extension-bold";
import {Code} from "@tiptap/extension-code";
import {Italic} from "@tiptap/extension-italic";
import {Strike} from "@tiptap/extension-strike";
import {Dropcursor} from "@tiptap/extension-dropcursor";
import {Gapcursor} from "@tiptap/extension-gapcursor";
import {History} from "@tiptap/extension-history";
import {Highlight} from "@tiptap/extension-highlight";
import {BubbleMenu} from "@tiptap/extension-bubble-menu";
import {DragHandle} from "@tiptap-pro/extension-drag-handle-react";
import {useDebouncedCallback} from "use-debounce";
import {Placeholder} from "@tiptap/extension-placeholder";
import {saveDocument} from "@/app/actions";

import "katex/dist/katex.min.css";
import {Mathematics} from "@tiptap-pro/extension-mathematics";
import {createSuggestionsItems, Slash, SlashCmd, SlashCmdProvider} from "@harshtalks/slash-tiptap";

const suggestions = createSuggestionsItems([
    {
        title: "Heading 1",
        searchTerms: ["heading", "h1"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({level: 1}).run();
        }
    },
    {
        title: "Heading 2",
        searchTerms: ["heading", "h2"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({level: 2}).run();
        }
    },
    {
        title: "Heading 3",
        searchTerms: ["heading", "h3"],
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setHeading({level: 3}).run();
        }
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

export default function Editor({content, id}: { content: string, id: string }) {
    const updateDocument = async (editor: EditorType) => {
        const storable = editor.getHTML();
        await saveDocument(id, storable);
    };

    const updateDebounced = useDebouncedCallback(
        updateDocument,
        1000
    );

    const editor = useEditor({
        extensions: [
            Blockquote,
            BulletList,
            CodeBlockShiki.configure({
                defaultTheme: "tokyo-night"
            }),
            Document,
            HardBreak,
            Heading.configure({levels: [1, 2, 3]}),
            HorizontalRule,
            ListItem,
            Mathematics,
            OrderedList,
            Paragraph,
            Placeholder.configure({
                placeholder: "Press / to see available commands",
                emptyEditorClass: "is-editor-empty text-gray-500"
            }),
            Slash.configure({
                suggestion: {
                    items: () => suggestions,
                },
            }),
            Text,

            Bold,
            Code,
            Highlight,
            Italic,
            Strike,

            BubbleMenu,
            Dropcursor,
            Gapcursor,
            History
        ],
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-base prose-p:mt-0 prose-headings:mb-4 prose-p:mb-2 m-5 px-8 focus:outline-none',
            },
        },
        content: content,
        onUpdate({editor}) {
            updateDebounced(editor);
        },
        async onBlur({editor}) {
            await updateDocument(editor);
        },
        async onDestroy() {
            if (!editor) return;
            await updateDocument(editor);
        }
    });

    if (!editor) return;

    return (
        <div>
            <DragHandle
                className={"flex items-center justify-center bg-gray-500 rounded-md border border-gray-700 w-6 h-6"}
                editor={editor}>
                <svg className={"w-4 h-4"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     strokeWidth="1.5"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5"/>
                </svg>
            </DragHandle>
            {editor &&
                <BubbleMenuJsx editor={editor} tippyOptions={{duration: 100}}>
                    <div className="bubble-menu">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={editor.isActive('bold') ? 'is-active' : ''}
                        >
                            Bold
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={editor.isActive('italic') ? 'is-active' : ''}
                        >
                            Italic
                        </button>
                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={editor.isActive('strike') ? 'is-active' : ''}
                        >
                            Strike
                        </button>
                    </div>
                </BubbleMenuJsx>}
            <SlashCmdProvider>
                <EditorContent editor={editor}/>
                <SlashCmd.Root editor={editor}>
                    <SlashCmd.Cmd className={"overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"}>
                        <SlashCmd.Empty className={"px-2 py-1.5 text-sm select-none"}>No commands available</SlashCmd.Empty>
                        <SlashCmd.List>
                            {suggestions.map((item) => {
                                return (
                                    <SlashCmd.Item
                                        className={"relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent hover:bg-accent focus:text-accent-foreground hover:text-accent-foreground"}
                                        value={item.title}
                                        onCommand={(val) => {
                                            item.command(val);
                                        }}
                                        key={item.title}
                                    >
                                        <p>{item.title}</p>
                                    </SlashCmd.Item>
                                );
                            })}
                        </SlashCmd.List>
                    </SlashCmd.Cmd>
                </SlashCmd.Root>
            </SlashCmdProvider>
        </div>
    )
}