import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, Strikethrough, List, Heading, Link, Image, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

type NewsEditorProps = {
  content: string;
  onChange: (content: string) => void;
};

export function NewsEditor({ content, onChange }: NewsEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] dark:prose-invert'
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) return null;

  const toggleFormat = (format: string) => {
    switch (format) {
      case 'bold':
        editor.chain().focus().toggleBold().run();
        break;
      case 'italic':
        editor.chain().focus().toggleItalic().run();
        break;
      case 'strike':
        editor.chain().focus().toggleStrike().run();
        break;
      case 'bullet':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'h1':
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 p-2 border rounded-t-lg bg-muted">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('bold')}
          className={editor.isActive('bold') ? 'bg-muted-foreground/20' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('italic')}
          className={editor.isActive('italic') ? 'bg-muted-foreground/20' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('strike')}
          className={editor.isActive('strike') ? 'bg-muted-foreground/20' : ''}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('bullet')}
          className={editor.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('h1')}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted-foreground/20' : ''}
        >
          <Heading className="h-4 w-4" />
          <span className="ml-1">1</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('h2')}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted-foreground/20' : ''}
        >
          <Heading className="h-4 w-4" />
          <span className="ml-1">2</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFormat('h3')}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted-foreground/20' : ''}
        >
          <Heading className="h-4 w-4" />
          <span className="ml-1">3</span>
        </Button>
        <Button variant="ghost" size="sm">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Table className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} className="min-h-[400px] border rounded-b-lg p-4" />
    </div>
  );
}