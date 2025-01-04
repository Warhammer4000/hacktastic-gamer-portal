import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NewsPreview } from "../preview/NewsPreview";

type PreviewNewsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  content: string;
};

export function PreviewNewsDialog({ open, onOpenChange, title, content }: PreviewNewsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{title}</h1>
          <NewsPreview content={content} />
        </div>
      </DialogContent>
    </Dialog>
  );
}