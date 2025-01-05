import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface AssignCouponsDialogProps {
  batch: {
    id: string;
    eligible_roles: string[];
    coupons: {
      id: string;
      code: string;
      assigned_to: string | null;
    }[];
  };
}

export function AssignCouponsDialog({ batch }: AssignCouponsDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get array of already assigned user IDs
  const assignedUserIds = batch.coupons
    .filter(c => c.assigned_to)
    .map(c => c.assigned_to);

  // Fetch eligible users based on roles
  const { data: eligibleUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["eligible-users", batch.id],
    queryFn: async () => {
      // First get all users with eligible roles
      const { data: usersWithRoles, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          user:profiles!inner(
            id,
            full_name,
            email
          )
        `)
        .in("role", batch.eligible_roles);

      if (error) throw error;

      // Filter out users who already have coupons from this batch
      return usersWithRoles.filter(
        user => !assignedUserIds.includes(user.user_id)
      );
    },
    enabled: open,
  });

  // Mutation for assigning coupons
  const assignCouponsMutation = useMutation({
    mutationFn: async (userIds: string[]) => {
      // Get available coupons
      const { data: availableCoupons, error: fetchError } = await supabase
        .from("coupons")
        .select("id, code, batch_id")
        .eq("batch_id", batch.id)
        .is("assigned_to", null)
        .limit(userIds.length);

      if (fetchError) throw fetchError;
      if (!availableCoupons || availableCoupons.length < userIds.length) {
        throw new Error("Not enough coupons available");
      }

      // Assign coupons to users
      const assignments = userIds.map((userId, index) => ({
        id: availableCoupons[index].id,
        assigned_to: userId,
        assigned_at: new Date().toISOString(),
      }));

      const { error: updateError } = await supabase
        .from("coupons")
        .upsert(assignments);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["couponBatches"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast({
        title: "Success",
        description: "Coupons assigned successfully",
      });
      setOpen(false);
      setSelectedUsers([]);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign coupons: " + error.message,
      });
    },
  });

  const handleAssign = () => {
    if (selectedUsers.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one user",
      });
      return;
    }
    assignCouponsMutation.mutate(selectedUsers);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          data-batch-id={batch.id}
          variant="ghost" 
          size="icon"
          className="hidden"
        >
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Coupons</DialogTitle>
          <DialogDescription>
            Select users to assign coupons from this batch.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Select Users</Label>
            {isLoadingUsers ? (
              <div>Loading users...</div>
            ) : (
              <ScrollArea className="h-[300px] rounded-md border p-4">
                {eligibleUsers?.map((user) => (
                  <div key={user.user_id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={user.user_id}
                      checked={selectedUsers.includes(user.user_id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.user_id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.user_id));
                        }
                      }}
                    />
                    <Label htmlFor={user.user_id} className="flex-1">
                      {user.user.full_name || user.user.email}
                      <div className="text-sm text-gray-500">
                        {user.role}
                      </div>
                    </Label>
                  </div>
                ))}
                {eligibleUsers?.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No eligible users found or all users already have coupons from this batch
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
          <Button 
            onClick={handleAssign}
            disabled={selectedUsers.length === 0 || assignCouponsMutation.isPending}
          >
            {assignCouponsMutation.isPending ? "Assigning..." : "Assign Coupons"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}