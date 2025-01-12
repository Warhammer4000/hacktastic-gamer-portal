import { Button } from "@/components/ui/button";

interface DialogFooterProps {
  onClose: () => void;
  onSave: () => void;
  isSubmitting: boolean;
}

export function DialogFooter({ onClose, onSave, isSubmitting }: DialogFooterProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button onClick={onSave} disabled={isSubmitting}>
        Save Changes
      </Button>
    </div>
  );
}