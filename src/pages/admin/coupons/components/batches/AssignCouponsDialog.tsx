import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, CheckSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserSelectionList } from "./UserSelectionList";

type UserRole = "participant" | "mentor" | "admin" | "organizer" | "moderator";

interface AssignCouponsDialogProps {
  batch: {
    id: string;
    eligible_roles: UserRole[];
    coupons: {
      id: string;
      code: string;
      batch_id: string;
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
    .filter((c) => c.assigned_to)
    .map((c) => c.assigned_to);

  // Fetch eligible users based on roles
  const { data: eligibleUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["eligible-users", batch.id],
    queryFn: async () => {
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
        .in("role", batch.eligible_roles as UserRole[]);

      if (error) throw error;

      // Filter out users who already have coupons from this batch
      return usersWithRoles.filter(
        (user) => !assignedUserIds.includes(user.user_id)
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
        code: availableCoupons[index].code,
        batch_id: availableCoupons[index].batch_id,
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

  const handleSelectAll = () => {
    if (!eligibleUsers) return;

    if (selectedUsers.length === eligibleUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(eligibleUsers.map((user) => user.user_id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Users className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Coupons</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Select Users</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                {selectedUsers.length === (eligibleUsers?.length || 0)
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <UserSelectionList
              users={eligibleUsers || []}
              selectedUsers={selectedUsers}
              onSelectionChange={setSelectedUsers}
              isLoading={isLoadingUsers}
            />
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
