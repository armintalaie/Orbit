import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useContext, useRef } from 'react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { Markdown } from 'tiptap-markdown';
import Blockquote from '@tiptap/extension-blockquote';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Underline from '@tiptap/extension-underline';
import { FontBoldIcon, FontItalicIcon, ListBulletIcon, UnderlineIcon } from '@radix-ui/react-icons';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Code2Icon,
  CodeIcon,
  FilePlus,
  HighlighterIcon,
  ListOrderedIcon,
  StrikethroughIcon,
  TextQuote,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../../ui/sheet';
import { toast } from 'sonner';
import { useMutation } from '@apollo/client';
import { UPDATE_ISSUE } from '@/lib/hooks/Issues/useMutateIssue';
import { OrbitContext } from '@/lib/context/OrbitGeneralContext';
import useInterval from '@/lib/hooks/useInterval';
import moment from 'moment';

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

export default function TextEditor({ issue }: { issue: any }) {
  const intervalId = useRef(null);
  const { workspace } = useContext(OrbitContext);
  const [draft, setDraft] = React.useState(issue.content);
  const [srcContent, setSrcContent] = React.useState(issue.content);
  const [state, setState] = React.useState<string>(moment(issue.updatedAt, 'x').format('HH:mm:ss').toString());
  const [updateIssue, { error, data }] = useMutation(UPDATE_ISSUE);
  async function submitPatch(data: any) {
    await updateIssue({
      variables: {
        workspaceId: workspace.id,
        issue: data,
        id: issue.id,
      },
    });
  }

  function runContentUpdate() {
    if (draft !== srcContent) {
      updateIssue({
        variables: {
          workspaceId: workspace.id,
          issue: { content: draft },
          id: issue.id,
        },
      }).then((value) => {
        setState(`${moment().format('HH:mm:ss')}`);
        setSrcContent(draft);
      });
    } else {
    }
  }

  useInterval(runContentUpdate, 5000);

  const editor = useEditor({
    editorProps: {
      attributes: {
        id: 'editor',
        class: ' prose-sm dark:prose-invert p-6 w-full max-w-6xl h-full outline-none text-xs',
      },
    },
    onUpdate: ({ editor }) => {
      setDraft(editor.storage.markdown.getMarkdown());
    },
    onFocus: ({ editor, event }) => {
      console.log('focus', event);
    },
    onTransaction: ({ editor, transaction }) => {
      // console.log('transaction', transaction);
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
      Highlight,
      Document,
      Markdown,
      Youtube,
      Link.configure({
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
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
    ],
    content: srcContent,
  });

  return (
    <div className={` relative flex flex-grow flex-col overflow-hidden`}>
      <MenuBar editor={editor} issue={issue} />
      <div className='relative flex flex-grow flex-col overflow-scroll'>
        {editor && editor.storage && editor.storage.characterCount.characters() >= LIMIT && (
          <div
            className={`absolute bottom-3 left-3 z-20 m-0 flex h-8 w-fit  items-center rounded-md border p-2 text-xs ${
              editor.storage.characterCount.characters() >= LIMIT ? 'bg-red-100 text-red-600' : ''
            }`}
          >
            {editor.storage.characterCount.characters()}/{LIMIT} words
          </div>
        )}

        <span className='text-2xs absolute right-2 top-0 z-20 m-0 flex h-6 w-fit items-center rounded-md  bg-inherit px-2 '>
          {`Last saved: ${state}`}
          {draft === srcContent ? ' (no new changes)' : ' (to be saved)'}
        </span>
        <div className=' relative h-full w-full flex-1 justify-center overflow-scroll '>
          <EditorContent editor={editor} className='flex h-full w-full flex-grow flex-col items-center  ' />
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
    if (
      editor.isActive('heading', {
        level: 1,
      })
    ) {
      return 'h1';
    } else if (
      editor.isActive('heading', {
        level: 2,
      })
    ) {
      return 'h2';
    } else if (
      editor.isActive('heading', {
        level: 3,
      })
    ) {
      return 'h3';
    } else {
      return undefined;
    }
  }

  function whichStylingsAreSelected() {
    const stylings = ['bold', 'italic', 'strikethrough', 'underline', 'code', 'highlight'];
    const selectedStylings: string[] = [];
    for (const styling of stylings) {
      if (editor.isActive(styling)) {
        selectedStylings.push(styling);
      }
    }
    return selectedStylings;
  }

  function whichContainerIsSelected() {
    const containers = ['bulletList', 'orderedItem', 'blockquote', 'codeBlock', 'taskItem'];
    for (const container of containers) {
      if (editor.isActive(container)) {
        return container;
      }
    }
    return undefined;
  }

  return (
    <div className='f flex  h-12 w-full flex-shrink-0  flex-row items-center justify-between overflow-x-scroll border-y  '>
      <div className='sticky  z-10 m-0 flex h-full w-full min-w-fit flex-row items-center justify-center gap-2 p-0  text-xs '>
        <ToggleGroup type='single' className='h-full min-w-fit overflow-hidden    ' value={whichHeadingIsSelected()}>
          <ToggleGroupItem
            value='h1'
            aria-label='Toggleh1'
            onClick={() =>
              editor
                .chain()
                .focus()
                .setHeading({
                  level: 1,
                })
                .run()
            }
          >
            H1
          </ToggleGroupItem>

          <ToggleGroupItem
            value='h2'
            aria-label='Toggleh2'
            onClick={() =>
              editor
                .chain()
                .focus()
                .setHeading({
                  level: 2,
                })
                .run()
            }
          >
            H2
          </ToggleGroupItem>

          <ToggleGroupItem
            value='h3'
            aria-label='Toggleh3'
            onClick={() =>
              editor
                .chain()
                .focus()
                .setHeading({
                  level: 3,
                })
                .run()
            }
          >
            H3
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type='multiple' value={whichStylingsAreSelected()} className='h-full min-w-fit overflow-hidden  '>
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
              editor
                .chain()
                .focus()
                .toggleHighlight({
                  color: '#ffcc00',
                })
                .run()
            }
          >
            <HighlighterIcon className='h-4 w-4' />
          </ToggleGroupItem>
        </ToggleGroup>

        <ToggleGroup value={whichContainerIsSelected()} type='single' className='h-full min-w-fit overflow-hidden  '>
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

          {/*<ToggleGroupItem*/}
          {/*  value='taskItem'*/}
          {/*  aria-label='Toggle task list'*/}
          {/*  onClick={() => editor.chain().focus().toggleTaskList().run()}*/}
          {/*>*/}
          {/*  <ListTodoIcon className='h-4 w-4' />*/}
          {/*</ToggleGroupItem>*/}

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
        <button className='e flex h-8 w-full items-center rounded-sm p-1 px-2 text-left text-xs  '>
          <FilePlus className='h-4 w-4' />
        </button>
      </SheetTrigger>
      <SheetContent className='flex max-w-full flex-col sm:max-w-2xl'>
        {/* {issue && issue.teamid && <IssueTemplates teamid={issue.teamid} sendTemplate={sendTemplate} />} */}
      </SheetContent>
    </Sheet>
  );
}
