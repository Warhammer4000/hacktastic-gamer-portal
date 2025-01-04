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
      <form className="space-y-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-[calc(60vh-16rem)]">
                      <NewsEditor content={field.value} onChange={field.onChange} />
                    </div>
                    <div className="border rounded-lg p-4 h-[calc(60vh-16rem)] overflow-y-auto">
                      <NewsPreview content={field.value} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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