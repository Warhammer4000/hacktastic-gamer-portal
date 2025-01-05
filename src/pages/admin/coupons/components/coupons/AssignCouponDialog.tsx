import { useState, useEffect } from "react";
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
    try {
      setLoadingUsers(true);
      console.log('Loading eligible users for batch:', batchId);
      
      // First, get the batch details to check eligible roles
      const { data: batchData, error: batchError } = await supabase
        .from('coupon_batches')
        .select('eligible_roles')
        .eq('id', batchId)
        .single();

      if (batchError) {
        console.error('Error fetching batch:', batchError);
        throw batchError;
      }

      console.log('Batch data:', batchData);

      // First get the list of users who already have coupons from this batch
      const { data: assignedUsers, error: assignedError } = await supabase
        .from('coupons')
        .select('assigned_to')
        .eq('batch_id', batchId)
        .not('assigned_to', 'is', null);

      if (assignedError) {
        console.error('Error fetching assigned users:', assignedError);
        throw assignedError;
      }

      const assignedUserIds = assignedUsers.map(u => u.assigned_to);

      // Then get eligible users who haven't been assigned a coupon
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
        .not('user_id', 'in', assignedUserIds);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      console.log('Eligible users:', eligibleUsers);
      setUsers(eligibleUsers || []);
    } catch (error: any) {
      console.error('Error in loadEligibleUsers:', error);
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

  // Load users when dialog opens
  useEffect(() => {
    if (open) {
      loadEligibleUsers();
      setSelectedUsers([]);
    }
  }, [open, batchId]);

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