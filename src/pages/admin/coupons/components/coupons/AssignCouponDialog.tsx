import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSelectionList } from "../batches/UserSelectionList";
import { useQuery } from "@tanstack/react-query";

interface AssignCouponDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  couponId: string | null;
  batchId: string;
  onAssigned: () => void;
}

export function AssignCouponDialog({
  open,
  onOpenChange,
  couponId,
  batchId,
  onAssigned,
}: AssignCouponDialogProps) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get array of already assigned user IDs
  const { data: eligibleUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["eligible-users", batchId],
    queryFn: async () => {
      // First get the batch details to check eligible roles
      const { data: batchData, error: batchError } = await supabase
        .from('coupon_batches')
        .select('eligible_roles')
        .eq('id', batchId)
        .single();

      if (batchError) throw batchError;

      const { data: usersWithRoles, error } = await supabase
        .from("user_roles")
        .select(
          `
          user_id,
          role,
          user:profiles!inner(
            id,
            full_name,
            email
          )
        `
        )
        .in("role", batchData.eligible_roles);

      if (error) throw error;

      // Filter out users who already have coupons from this batch
      const { data: assignedUsers } = await supabase
        .from("coupons")
        .select("assigned_to")
        .eq("batch_id", batchId)
        .not("assigned_to", "is", null);

      const assignedUserIds = assignedUsers?.map((u) => u.assigned_to) || [];

      return usersWithRoles.filter(
        (user) => !assignedUserIds.includes(user.user_id)
      );
    },
    enabled: open,
  });

  const handleAssign = async () => {
    if (!couponId || selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a user to assign the coupon to",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ 
          assigned_to: selectedUsers[0],
          assigned_at: new Date().toISOString()
        })
        .eq('id', couponId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon assigned successfully",
      });
      
      onAssigned();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error assigning coupon:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign coupon",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedUsers([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Coupon</DialogTitle>
          <DialogDescription>
            Select a user to assign this coupon to.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <UserSelectionList
            users={eligibleUsers || []}
            selectedUsers={selectedUsers}
            onSelectionChange={(selected) => setSelectedUsers(selected)}
            isLoading={isLoadingUsers}
          />
          <Button 
            onClick={handleAssign} 
            disabled={selectedUsers.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? "Assigning..." : "Assign Coupon"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}