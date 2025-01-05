import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSelectionList } from "../batches/UserSelectionList";

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
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const loadEligibleUsers = async () => {
    setLoadingUsers(true);
    try {
      // First, get the batch details to check eligible roles
      const { data: batchData, error: batchError } = await supabase
        .from('coupon_batches')
        .select('eligible_roles')
        .eq('id', batchId)
        .single();

      if (batchError) throw batchError;

      // Get users who have the eligible roles and haven't been assigned a coupon from this batch
      const { data: eligibleUsers, error: usersError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          role,
          user:profiles!inner(
            id,
            full_name,
            email
          )
        `)
        .in('role', batchData.eligible_roles)
        .not('user_id', 'in', (sb) =>
          sb.from('coupons')
            .select('assigned_to')
            .eq('batch_id', batchId)
            .not('assigned_to', 'is', null)
        );

      if (usersError) throw usersError;
      setUsers(eligibleUsers || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load eligible users",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

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
    const { error } = await supabase
      .from('coupons')
      .update({ 
        assigned_to: selectedUsers[0],
        assigned_at: new Date().toISOString()
      })
      .eq('id', couponId);

    setIsLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign coupon",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Coupon assigned successfully",
    });
    
    onAssigned();
    onOpenChange(false);
  };

  // Load users when dialog opens
  useState(() => {
    if (open) {
      loadEligibleUsers();
      setSelectedUsers([]);
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Coupon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <UserSelectionList
            users={users}
            selectedUsers={selectedUsers}
            onSelectionChange={(selected) => setSelectedUsers(selected)}
            isLoading={loadingUsers}
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