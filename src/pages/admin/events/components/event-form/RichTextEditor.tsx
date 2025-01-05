import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  Link as LinkIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Quote
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none min-h-[200px] p-4 dark:prose-invert'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center flex-wrap gap-1 p-2 border-b bg-muted">
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          isActive={editor?.isActive('bold')}
          icon={<Bold className="h-4 w-4" />}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          isActive={editor?.isActive('italic')}
          icon={<Italic className="h-4 w-4" />}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          isActive={editor?.isActive('strike')}
          icon={<Strikethrough className="h-4 w-4" />}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          isActive={editor?.isActive('bulletList')}
          icon={<List className="h-4 w-4" />}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          isActive={editor?.isActive('blockquote')}
          icon={<Quote className="h-4 w-4" />}
        />
        <EditorButton
          onClick={addLink}
          isActive={editor?.isActive('link')}
          icon={<LinkIcon className="h-4 w-4" />}
        />
        <EditorButton
          onClick={addTable}
          isActive={false}
          icon={<TableIcon className="h-4 w-4" />}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
          isActive={editor?.isActive({ textAlign: 'left' })}
          icon={<AlignLeft className="h-4 w-4" />}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
          isActive={editor?.isActive({ textAlign: 'center' })}
          icon={<AlignCenter className="h-4 w-4" />}
        />
        <EditorButton
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
          isActive={editor?.isActive({ textAlign: 'right' })}
          icon={<AlignRight className="h-4 w-4" />}
        />
      </div>
      <div className="relative w-full" style={{ height: '200px' }}>
        <EditorContent 
          editor={editor} 
          className="absolute inset-0 overflow-auto"
        />
      </div>
    </div>
  );
}

interface EditorButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
}

function EditorButton({ onClick, isActive, icon }: EditorButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`h-8 px-2 ${isActive ? 'bg-muted-foreground/20' : ''}`}
      type="button"
    >
      {icon}
    </Button>
  );
}