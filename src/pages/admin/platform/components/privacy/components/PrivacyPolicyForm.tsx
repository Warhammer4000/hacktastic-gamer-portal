import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewsEditor } from "../../news/editor/NewsEditor";
import { NewsPreview } from "../../news/preview/NewsPreview";
import { Eye } from "lucide-react";

type FormValues = {
  content: string;
  version: string;
};

type PrivacyPolicyFormProps = {
  defaultValues: FormValues;
  isSubmitting: boolean;
  isPreview: boolean;
  onSubmit: (values: FormValues, status: 'draft' | 'published') => void;
  onCancel: () => void;
  onTogglePreview: () => void;
};

export function PrivacyPolicyForm({ 
  defaultValues, 
  isSubmitting, 
  isPreview,
  onSubmit, 
  onCancel,
  onTogglePreview 
}: PrivacyPolicyFormProps) {
  const form = useForm<FormValues>({
    defaultValues,
  });

  return (
    <Form {...form}>
      <form className="space-y-4 h-full flex flex-col">
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
                  <div className="grid grid-cols-1 gap-4">
                    <NewsEditor content={field.value} onChange={field.onChange} />
                    {isPreview && (
                      <div className="border rounded-lg p-4">
                        <NewsPreview content={field.value} />
                      </div>
                    )}
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
            onClick={onTogglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Hide Preview' : 'Show Preview'}
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