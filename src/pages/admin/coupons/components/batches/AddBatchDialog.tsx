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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

export const AddBatchDialog = ({ vendors }: { vendors: any[] }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [redemptionInstructions, setRedemptionInstructions] = useState("");
  const [eligibleRoles, setEligibleRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("coupon_batches").insert({
        name,
        description,
        vendor_id: vendorId,
        redemption_instructions: redemptionInstructions,
        eligible_roles: eligibleRoles,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Batch created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["couponBatches"] });
      setOpen(false);
      setName("");
      setDescription("");
      setVendorId("");
      setRedemptionInstructions("");
      setEligibleRoles([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create batch",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const roles: UserRole[] = ["participant", "mentor"];

  const handleRoleToggle = (role: UserRole) => {
    setEligibleRoles((current) =>
      current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Batch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Coupon Batch</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Batch Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Select value={vendorId} onValueChange={setVendorId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="redemptionInstructions">
              Redemption Instructions
            </Label>
            <Textarea
              id="redemptionInstructions"
              value={redemptionInstructions}
              onChange={(e) => setRedemptionInstructions(e.target.value)}
              required
            />
          </div>
          <div>
            <Label>Eligible Roles</Label>
            <div className="space-y-2 mt-2">
              {roles.map((role) => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox
                    id={role}
                    checked={eligibleRoles.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                  />
                  <Label htmlFor={role} className="capitalize">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Batch"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};