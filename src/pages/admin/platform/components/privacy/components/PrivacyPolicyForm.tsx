import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewsEditor } from "../../news/editor/NewsEditor";
import { NewsPreview } from "../../news/preview/NewsPreview";

type FormValues = {
  content: string;
  version: string;
};

type PrivacyPolicyFormProps = {
  defaultValues: FormValues;
  isSubmitting: boolean;
  onSubmit: (values: FormValues, status: 'draft' | 'published') => void;
  onCancel: () => void;
};

export function PrivacyPolicyForm({ 
  defaultValues, 
  isSubmitting, 
  onSubmit, 
  onCancel,
}: PrivacyPolicyFormProps) {
  const form = useForm<FormValues>({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form className="flex flex-col h-[calc(80vh-8rem)]">
        <div className="space-y-4 px-2">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex-1 overflow-hidden mt-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="h-full">
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <div className="overflow-y-auto h-[calc(60vh-8rem)]">
                      <NewsEditor content={field.value} onChange={field.onChange} />
                    </div>
                    <div className="overflow-y-auto h-[calc(60vh-8rem)] border rounded-lg">
                      <NewsPreview content={field.value} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 mt-auto border-t bg-background">
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
            disabled={isSubmitting}
            onClick={() => form.handleSubmit((values) => onSubmit(values, 'draft'))()}
          >
            Save as Draft
          </Button>
          <Button 
            type="button"
            disabled={isSubmitting}
            onClick={() => form.handleSubmit((values) => onSubmit(values, 'published'))()}
          >
            {isSubmitting ? "Saving..." : "Publish"}
          </Button>
        </div>
      </form>
    </Form>
  );
}