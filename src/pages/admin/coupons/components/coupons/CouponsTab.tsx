import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchInput } from "@/components/participant/teams/components/SearchInput";
import { useState, useEffect } from "react";
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
      // Get the paginated data with count
      let query = supabase
        .from("coupons")
        .select(`
          *,
          batch:coupon_batches!inner(
            name,
            vendor:coupon_vendors!inner(name)
          ),
          assignee:profiles(full_name)
        `, { count: 'exact' });

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

      const { data, error, count } = await query;

      if (error) {
        // Handle range not satisfiable error
        if (error.code === 'PGRST103') {
          // Reset to first page if current page is out of range
          setCurrentPage(1);
          // Retry the query with the first page
          const retryQuery = await supabase
            .from("coupons")
            .select(`
              *,
              batch:coupon_batches!inner(
                name,
                vendor:coupon_vendors!inner(name)
              ),
              assignee:profiles(full_name)
            `, { count: 'exact' })
            .range(0, itemsPerPage - 1);

          if (retryQuery.error) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to load coupons",
            });
            throw retryQuery.error;
          }

          return {
            data: retryQuery.data || [],
            count: retryQuery.count || 0
          };
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load coupons",
        });
        throw error;
      }

      return { 
        data: data || [], 
        count: count || 0 
      };
    },
  });

  // Reset to first page when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handleSort = (field: "assigned_at" | "assignee") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
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
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
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