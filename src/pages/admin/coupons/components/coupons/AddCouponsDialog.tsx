import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export const AddCouponsDialog = ({ batchId }: { batchId: string }) => {
  const [open, setOpen] = useState(false);
  const [coupons, setCoupons] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const couponCodes = coupons
        .split("\n")
        .map((code) => code.trim())
        .filter((code) => code);

      const { error } = await supabase.from("coupons").insert(
        couponCodes.map((code) => ({
          batch_id: batchId,
          code,
        }))
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: `${couponCodes.length} coupons added successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setOpen(false);
      setCoupons("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add coupons",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Coupons
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Coupons to Batch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="coupons">
              Enter coupon codes (one per line)
            </Label>
            <Textarea
              id="coupons"
              value={coupons}
              onChange={(e) => setCoupons(e.target.value)}
              required
              rows={10}
              placeholder="COUPON-001&#10;COUPON-002&#10;COUPON-003"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Coupons"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};