import './styles.css';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Markdown } from 'tiptap-markdown';
import Blockquote from '@tiptap/extension-blockquote';

import {
  FontBoldIcon,
  FontItalicIcon,
  ListBulletIcon,
  UnderlineIcon,
} from '@radix-ui/react-icons';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Code2Icon,
  CodeIcon,
  CodesandboxIcon,
  HighlighterIcon,
  ListOrderedIcon,
  Quote,
  QuoteIcon,
  StrikethroughIcon,
  TextQuote,
} from 'lucide-react';
import { Button } from '../ui/button';

const cont = `## Issue Title: Website Backend API Redesign

### Description
We need to redesign our website's backend API to improve performance, security, and maintainability. The current API has several issues that are hindering our development speed and the overall performance of our website.

### Tasks
- Analyze the current API and identify areas for improvement
- Design a new architecture for the API
- Implement the new API design
- Test the new API to ensure it meets performance and security standards
- Update the website to use the new API
- Document the new API

### Acceptance Criteria
- The new API should be faster and more secure than the current API
- The new API should be easy to maintain and extend
- The website should function correctly with the new API

### Additional Information
Please coordinate with the frontend team to ensure the new API meets their needs. Also, make sure to follow best practices for API design and implementation.`;
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-background-color'),
        renderHTML: (attributes) => {
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

export default function TextEditor({
  onSave,
  content,
}: {
  onSave: (content: string) => Promise<void>;
  content: string;
}) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: '  w-full focus:outline-none h-full p-2 px-0',
      },
    },

    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      // Default TableCell
      // TableCell,
      // Custom TableCell with backgroundColor attribute
      Blockquote,
      CustomTableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Heading.configure({
        HTMLAttributes: {
          class: 'text-xl',
        },
      }),
      Highlight,
      Document,
      Markdown,

      Paragraph,
      Text,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Whats the title?';
          }

          return 'Start writing...';
        },
      }),
    ],
    content: content,
  });

  return (
    <div className=''>
      <MenuBar editor={editor} saveContentChanges={onSave} />
      <div className='p-4'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export function MenuBar({
  editor,
  saveContentChanges,
}: {
  editor: any;
  saveContentChanges: (content: string) => Promise<void>;
}) {
  if (!editor) {
    return null;
  }

  function whichHeadingIsSelected() {
    if (editor.isActive('heading', { level: 1 })) {
      return 'h1';
    } else if (editor.isActive('heading', { level: 2 })) {
      return 'h2';
    } else if (editor.isActive('heading', { level: 3 })) {
      return 'h3';
    } else {
      return undefined;
    }
  }

  function whichStylingsAreSelected() {
    const stylings = [
      'bold',
      'italic',
      'strikethrough',
      'underline',
      'code',
      'highlight',
    ];
    const selectedStylings: string[] = [];
    for (const styling of stylings) {
      if (editor.isActive(styling)) {
        selectedStylings.push(styling);
      }
    }
    return selectedStylings;
  }

  function whichContainerIsSelected() {
    const containers = ['listItem', 'orderedItem', 'blockquote', 'codeBlock'];
    for (const container of containers) {
      if (editor.isActive(container)) {
        return container;
      }
    }
    return undefined;
  }

  return (
    <div className='h-15 flex w-full flex-row  items-center justify-between overflow-x-scroll border-y  border-gray-100 bg-white p-2 py-3'>
      <div className='sticky  top-5 z-10 m-0 flex w-full min-w-fit flex-row items-center justify-center gap-2 p-0 text-xs'>
        <ToggleGroup
          type='single'
          className='h-6 min-w-fit overflow-hidden rounded-md border border-gray-200 bg-white'
          value={whichHeadingIsSelected()}
        >
          <ToggleGroupItem
            value='h1'
            aria-label='Toggleh1'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 1 }).run()
            }
          >
            H1
          </ToggleGroupItem>

          <ToggleGroupItem
            value='h2'
            aria-label='Toggleh2'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 2 }).run()
            }
          >
            H2
          </ToggleGroupItem>

          <ToggleGroupItem
            value='h3'
            aria-label='Toggleh3'
            onClick={() =>
              editor.chain().focus().setHeading({ level: 3 }).run()
            }
          >
            H3
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type='multiple'
          value={whichStylingsAreSelected()}
          className='h-6   min-w-fit overflow-hidden rounded-md border border-gray-200 bg-white'
        >
          <ToggleGroupItem
            value='bold'
            aria-label='Toggle bold'
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FontBoldIcon className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='italic'
            aria-label='Toggle italic'
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FontItalicIcon className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='strikethrough'
            aria-label='Toggle strikethrough'
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikethroughIcon className='h-4 w-4' />
          </ToggleGroupItem>

          <ToggleGroupItem
            value='underline'
            aria-label='Toggle strikethrough'
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='code'
            aria-label='Toggle inline code'
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <CodeIcon className='h-4 w-4' />
          </ToggleGroupItem>
          <ToggleGroupItem
            value='highlight'
            aria-label='Toggle hightlight'
            onClick={() =>
              editor.chain().focus().toggleHighlight({ color: '#ffcc00' }).run()
            }
          >
            <HighlighterIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup
          value={whichContainerIsSelected()}
          type='single'
          className='h-6   min-w-fit overflow-hidden rounded-md border border-gray-200 bg-white'
        >
          <ToggleGroupItem
            value='listItem'
            aria-label='Toggle unordered list'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <ListBulletIcon className='h-4 w-4' />
          </ToggleGroupItem>

          <ToggleGroupItem
            value='orderedItem'
            aria-label='Toggle ordered list'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrderedIcon className='h-4 w-4' />
          </ToggleGroupItem>

          <ToggleGroupItem
            value='blockquote'
            aria-label='Toggle quote'
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <TextQuote className='h-4 w-4' />
          </ToggleGroupItem>

          <ToggleGroupItem
            value='codeBlock'
            aria-label='Toggle code block'
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code2Icon className='h-4 w-4' />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button
        variant='outline'
        className='m-0 h-6 p-2 text-xs'
        onClick={async () => {
          const content = editor.storage.markdown.getMarkdown();
          await saveContentChanges(content);
        }}
      >
        save changes
      </Button>
    </div>
  );
}
