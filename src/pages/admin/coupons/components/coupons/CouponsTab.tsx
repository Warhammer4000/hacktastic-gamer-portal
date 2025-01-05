import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchInput } from "@/components/participant/teams/components/SearchInput";
import { useState } from "react";
import { CouponsTable } from "./CouponsTable";

export const CouponsTab = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"assigned_at" | "assignee">("assigned_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: couponsData, isLoading } = useQuery({
    queryKey: ["coupons", search, sortField, sortOrder, currentPage, itemsPerPage],
    queryFn: async () => {
      // First, get the total count
      const countQuery = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true });

      if (countQuery.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to get total count",
        });
        throw countQuery.error;
      }

      // Then get the paginated data
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

      if (search) {
        query = query.or(`code.ilike.%${search}%,profiles.full_name.ilike.%${search}%`);
      }

      if (sortField === "assignee") {
        query = query.order("profiles.full_name", { ascending: sortOrder === "asc" });
      } else {
        query = query.order(sortField, { ascending: sortOrder === "asc" });
      }

      // Calculate the range for pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load coupons",
        });
        throw error;
      }

      return { 
        data, 
        count: countQuery.count || 0 
      };
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

      <CouponsTable 
        coupons={couponsData?.data || []} 
        onSort={handleSort}
        sortField={sortField}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};