import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EventFormValues } from "../../types/event-form";
import { TechStackField } from "./TechStackField";
import { RolesField } from "./RolesField";
import { DateTimeFields } from "./DateTimeFields";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface EventFormFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventFormFields({ form }: EventFormFieldsProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: form.getValues("description"),
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[200px] max-h-[400px] overflow-y-auto dark:prose-invert'
      }
    },
    onUpdate: ({ editor }) => {
      form.setValue("description", editor.getHTML());
    }
  });

  return (
    <div className="space-y-6">
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
                <EditorContent editor={editor} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <TechStackField form={form} />
      <RolesField form={form} />
      <DateTimeFields form={form} />
    </div>
  );
}