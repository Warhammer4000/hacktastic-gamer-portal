import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "../../types/event-form";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, Heading } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BasicInfoFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.getValues("description"),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] dark:prose-invert'
      }
    },
    onUpdate: ({ editor }) => {
      form.setValue("description", editor.getHTML());
    }
  });

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
              <div className="border rounded-md">
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
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive('bulletList') ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor?.isActive('heading', { level: 2 }) ? 'bg-muted-foreground/20' : ''}
                    type="button"
                  >
                    <Heading className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <EditorContent editor={editor} />
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