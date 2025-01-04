import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { NewsEditor } from "../editor/NewsEditor";
import { NewsPreview } from "../preview/NewsPreview";
import { Eye } from "lucide-react";

type FormValues = {
  title: string;
  content: string;
  tags: string[];
  publishDate: string;
};

type NewsFormProps = {
  defaultValues: FormValues;
  isSubmitting: boolean;
  isPreview: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  onTogglePreview: () => void;
};

export function NewsForm({ 
  defaultValues, 
  isSubmitting, 
  isPreview, 
  onSubmit, 
  onCancel,
  onTogglePreview 
}: NewsFormProps) {
  const form = useForm<FormValues>({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter news title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publishDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publish Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Select or create tags"
                        selected={field.value}
                        options={[]}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-4">
                      <NewsEditor content={field.value} onChange={field.onChange} />
                      {isPreview && (
                        <NewsPreview content={field.value} />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-background">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onTogglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}