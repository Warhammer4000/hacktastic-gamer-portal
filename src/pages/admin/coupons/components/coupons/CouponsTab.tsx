import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SearchInput } from "@/components/participant/teams/components/SearchInput";
import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const CouponsTab = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"assigned_at" | "assignee">("assigned_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: couponsData, isLoading } = useQuery({
    queryKey: ["coupons", search, sortField, sortOrder, currentPage],
    queryFn: async () => {
      let query = supabase
        .from("coupons")
        .select(`
          *,
          batch:coupon_batches!inner(
            name,
            vendor:coupon_vendors!inner(name)
          ),
          assignee:profiles(full_name)
        `);

      // Apply search filter
      if (search) {
        query = query.or(`code.ilike.%${search}%,profiles.full_name.ilike.%${search}%`);
      }

      // Apply sorting
      if (sortField === "assignee") {
        query = query.order("profiles.full_name", { ascending: sortOrder === "asc" });
      } else {
        query = query.order(sortField, { ascending: sortOrder === "asc" });
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      query = query.range(from, from + itemsPerPage - 1);

      const { data, error, count } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load coupons",
        });
        throw error;
      }

      return { data, count };
    },
  });

  const handleSort = (field: "assigned_at" | "assignee") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const totalPages = couponsData?.count 
    ? Math.ceil(couponsData.count / itemsPerPage) 
    : 0;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Coupons</h2>
        <div className="w-72">
          <SearchInput
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search by code or assignee..."
          />
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden dark:border-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead onClick={() => handleSort("assignee")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Assigned To
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead onClick={() => handleSort("assigned_at")} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  Assigned At
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {couponsData?.data?.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.batch?.name}</TableCell>
                <TableCell>{coupon.batch?.vendor?.name}</TableCell>
                <TableCell>
                  {coupon.assignee?.[0]?.full_name || "Unassigned"}
                </TableCell>
                <TableCell>
                  {coupon.assigned_at
                    ? new Date(coupon.assigned_at).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {!coupon.assigned_to && (
                    <Button variant="outline" size="sm">
                      Assign
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }

              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNumber)}
                    isActive={currentPage === pageNumber}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <PaginationItem>
                  <span className="flex h-9 w-9 items-center justify-center">...</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};