import { cn } from "@/lib/utils";

type NewsPreviewProps = {
  content: string;
  className?: string;
};

export function NewsPreview({ content, className }: NewsPreviewProps) {
  return (
    <div className={cn("prose dark:prose-invert max-w-none p-4 border rounded-lg", className)}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}