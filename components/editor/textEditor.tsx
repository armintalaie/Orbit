import './styles.css';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
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
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import Mention from '@tiptap/extension-mention';
import suggestion from './suggestion';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
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
  FilePlus,
  HighlighterIcon,
  ListOrderedIcon,
  ListTodoIcon,
  SaveIcon,
  StrikethroughIcon,
  TextQuote,
} from 'lucide-react';
import { Button } from '../ui/button';
import IssueTemplates from '../teams/IssueTemplates';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { toast } from 'sonner';

const LIMIT = 500 * 10;
const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
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
  className,
  onUpdate,
  issue,
}: {
  onSave?: (content: string) => Promise<void>;
  content?: string;
  className?: string;
  onUpdate?: (content: string) => Promise<void>;
  issue: any;
}) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class:
          '  w-full focus:outline-none p-2 text-neutral-800 border-b-gray-200 dark:text-neutral-300 border-b-gray-200 dark:border-b-neutral-600',
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        const html = editor.getHTML();
        const content = editor.storage.markdown.getMarkdown();
        onUpdate(content, html);
      }
    },
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,

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
      Youtube,
      Link.configure({
        HTMLAttributes: {
          // Change rel to different value
          // Allow search engines to follow links(remove nofollow)
          rel: 'noopener noreferrer',
          // Remove target entirely so links open in current tab
          target: null,
        },
      }),
      Underline,
      Paragraph,
      Text,
      TaskList.configure({
        itemTypeName: 'taskItem',
      }),
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
      CharacterCount.configure({
        limit: LIMIT,
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        suggestion: suggestion,
        // <UserFinder teamid={1}/>
      }),
    ],
    content: content,
  });

  useEffect(() => {
    if (content && editor) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <div
      className={` relative flex flex-grow flex-col overflow-hidden ${className}`}
    >
      <MenuBar editor={editor} issue={issue} />
      <div className='relative flex flex-grow flex-col overflow-scroll'>
        {editor &&
          editor.storage &&
          editor.storage.characterCount.characters() >= LIMIT && (
            <div
              className={`absolute bottom-3 left-3 z-20 m-0 flex h-8 w-fit  items-center rounded-md border bg-neutral-100 p-2 text-xs text-neutral-600 ${
                editor.storage.characterCount.characters() >= LIMIT
                  ? 'bg-red-100 text-red-600'
                  : ''
              }`}
            >
              {editor.storage.characterCount.characters()}/{LIMIT} words
            </div>
          )}

        {onSave && (
          <Button
            variant='outline'
            className='absolute right-3 top-3 z-20 m-0 flex h-8 w-fit items-center rounded-md bg-inherit bg-neutral-700 px-2 text-2xs text-neutral-700 dark:text-neutral-400'
            onClick={async () => {
              const content = editor.storage.markdown.getMarkdown();
              await onSave(content);
              toast('Your changes have been saved');
            }}
          >
            <SaveIcon className='mr-1 h-3 w-3' />
            Save
          </Button>
        )}
        <div className=' relative h-full w-full flex-1 justify-center overflow-scroll bg-gray-50 dark:bg-neutral-900'>
          <EditorContent
            editor={editor}
            className='flex h-full w-full flex-grow flex-col items-center  bg-gray-50 dark:bg-neutral-900'
          />
        </div>
      </div>
    </div>
  );
}

export function MenuBar({ editor, issue }: { editor: any; issue: any }) {
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
    const containers = [
      'bulletList',
      'orderedItem',
      'blockquote',
      'codeBlock',
      'taskItem',
    ];
    for (const container of containers) {
      if (editor.isActive(container)) {
        return container;
      }
    }
    return undefined;
  }

  return (
    <div className='h-15 min-h-15  flex w-full flex-row  items-center justify-between overflow-x-scroll border-y  border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-900'>
      <div className='sticky  z-10 m-0 flex h-full w-full min-w-fit flex-row items-center justify-center gap-2 p-0  text-xs '>
        <ToggleGroup
          type='single'
          className='h-full min-w-fit overflow-hidden    '
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
          className='h-full min-w-fit overflow-hidden  '
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
          className='h-full min-w-fit overflow-hidden  '
        >
          <ToggleGroupItem
            value='bulletList'
            aria-label='Toggle unordered list'
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <ListBulletIcon className='h-4 w-4' />
          </ToggleGroupItem>

          <ToggleGroupItem
            value='orderedList'
            aria-label='Toggle ordered list'
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrderedIcon className='h-4 w-4' />
          </ToggleGroupItem>

          <ToggleGroupItem
            value='taskItem'
            aria-label='Toggle task list'
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <ListTodoIcon className='h-4 w-4' />
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

        <div className=' flex  h-full min-w-fit  items-center gap-4 overflow-hidden px-2'>
          {/* <div  aria-label='Toggle mention'>
            <ImagePlusIcon className='h-4 w-4' />
          </div> */}
          {issue && issue.teamid && (
            <div aria-label='Toggle template'>
              <TemplatePopover editor={editor} issue={issue} />
            </div>
          )}

          {/* <div  aria-label='Toggle mention'>
            <FileSymlinkIcon className='h-4 w-4' />
          </div> */}

          {/* <div value='mention' aria-label='Toggle mention'>
            <PaperclipIcon className='h-4 w-4' />
          </div>

          <div value='mention' aria-label='Toggle mention'>
            <AtSignIcon className='h-4 w-4' />
          </div> */}
        </div>
      </div>
    </div>
  );
}

function TemplatePopover({ editor, issue }: { editor: any; issue: any }) {
  const [open, setOpen] = React.useState(false);
  function sendTemplate(template: string) {
    editor.chain().focus().insertContent(template).run();
    toast('Template inserted');
    setOpen(false);
  }
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className='e flex h-8 w-full items-center rounded-sm p-1 px-2 text-left text-xs  dark:border-neutral-800 dark:bg-neutral-800'>
          <FilePlus className='h-4 w-4' />
        </button>
      </SheetTrigger>
      <SheetContent className='flex max-w-full flex-col sm:max-w-2xl'>
        {issue && issue.teamid && (
          <IssueTemplates teamid={issue.teamid} sendTemplate={sendTemplate} />
        )}
      </SheetContent>
    </Sheet>
  );
}
