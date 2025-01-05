import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CouponsPagination } from "./CouponsPagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CouponsTableProps {
  coupons: any[];
  onSort: (field: "assigned_at" | "assignee") => void;
  sortField: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
}

export const CouponsTable = ({ 
  coupons, 
  onSort, 
  sortField,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange
}: CouponsTableProps) => {
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .order('full_name');

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users",
      });
      return;
    }

    setUsers(profiles || []);
  };

  const handleAssign = async () => {
    if (!selectedCouponId || !selectedUserId) {
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
        assigned_to: selectedUserId,
        assigned_at: new Date().toISOString()
      })
      .eq('id', selectedCouponId);

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
    
    setSelectedCouponId(null);
    setSelectedUserId("");
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead onClick={() => onSort("assignee")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Assigned To
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => onSort("assigned_at")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Assigned At
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons?.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.batch?.name}</TableCell>
                <TableCell>{coupon.batch?.vendor?.name}</TableCell>
                <TableCell>
                  {coupon.assignee?.[0]?.full_name || "Unassigned"}
                </TableCell>
                <TableCell>
                  {coupon.assigned_at
                    ? formatDate(coupon.assigned_at)
                    : "-"}
                </TableCell>
                <TableCell>
                  {!coupon.assigned_to && (
                    <Dialog onOpenChange={(open) => {
                      if (open) {
                        setSelectedCouponId(coupon.id);
                        loadUsers();
                      } else {
                        setSelectedCouponId(null);
                        setSelectedUserId("");
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Assign
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Coupon</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              Select User
                            </label>
                            <Select
                              value={selectedUserId}
                              onValueChange={setSelectedUserId}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                              </SelectTrigger>
                              <SelectContent>
                                {users.map((user) => (
                                  <SelectItem key={user.id} value={user.id}>
                                    {user.full_name || user.email}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button 
                            onClick={handleAssign} 
                            disabled={!selectedUserId || isLoading}
                            className="w-full"
                          >
                            {isLoading ? "Assigning..." : "Assign Coupon"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CouponsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};