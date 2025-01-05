import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { CouponsPagination } from "./CouponsPagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { AssignCouponDialog } from "./AssignCouponDialog";

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
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCouponId(coupon.id);
                        setSelectedBatchId(coupon.batch_id);
                      }}
                    >
                      Assign
                    </Button>
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

      <AssignCouponDialog
        open={!!selectedCouponId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCouponId(null);
            setSelectedBatchId(null);
          }
        }}
        couponId={selectedCouponId}
        batchId={selectedBatchId!}
        onAssigned={() => {
          // Trigger a refetch of the coupons data
          window.location.reload();
        }}
      />
    </div>
  );
};
