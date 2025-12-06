"use client";

import { cn } from "@/lib/utils";
import {
  MDXEditorProps,
  MDXEditorMethods,
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ListsToggle,
  InsertThematicBreak,
  InsertTable,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import { Ref } from "react";

export const markdownClassNames =
  "max-w-none prose prose-neutral dark:prose-invert font-sans";

export default function InternalMarkdownEditor({
  ref,
  className,
  ...props
}: MDXEditorProps & { ref?: Ref<MDXEditorMethods> }) {
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === "dark" || resolvedTheme === "dark";

  return (
    <MDXEditor
      {...props}
      ref={ref}
      className={cn(markdownClassNames, isDark && "dark-theme", className)}
      suppressHtmlProcessing
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <InsertThematicBreak />
              <InsertTable />
            </>
          ),
        }),
      ]}
    />
  );
}
