import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
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
  Quote,
  Underline
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BasicInfoFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
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
    content: form.getValues("description"),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] overflow-y-auto p-4 dark:prose-invert w-full max-w-none'
      }
    },
    onUpdate: ({ editor }) => {
      form.setValue("description", editor.getHTML());
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
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Event title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <div className="border rounded-md overflow-hidden">
                <div className="flex flex-wrap gap-2 p-2 border-b bg-muted">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive('bold') ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive('italic') ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    className={editor?.isActive('strike') ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <Strikethrough className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                    className={editor?.isActive('blockquote') ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addLink}
                    className={editor?.isActive('link') ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addTable}
                    type="button"
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                    className={editor?.isActive({ textAlign: 'left' }) ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                    className={editor?.isActive({ textAlign: 'center' }) ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                    className={editor?.isActive({ textAlign: 'right' }) ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="overflow-y-auto max-h-[400px] w-full">
                  <EditorContent editor={editor} className="w-full" />
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}