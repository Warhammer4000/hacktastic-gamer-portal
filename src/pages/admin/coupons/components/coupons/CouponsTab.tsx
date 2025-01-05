import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const CouponsTab = () => {
  const { toast } = useToast();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select(`
          *,
          batch:coupon_batches(
            name,
            vendor:coupon_vendors(name)
          ),
          assignee:profiles(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load coupons",
        });
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Coupons</h2>
      </div>

      <div className="border rounded-lg overflow-hidden dark:border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">Code</th>
              <th className="px-4 py-2 text-left">Batch</th>
              <th className="px-4 py-2 text-left">Vendor</th>
              <th className="px-4 py-2 text-left">Assigned To</th>
              <th className="px-4 py-2 text-left">Assigned At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((coupon) => (
              <tr
                key={coupon.id}
                className="border-t dark:border-gray-800"
              >
                <td className="px-4 py-2">{coupon.code}</td>
                <td className="px-4 py-2">{coupon.batch.name}</td>
                <td className="px-4 py-2">{coupon.batch.vendor.name}</td>
                <td className="px-4 py-2">
                  {coupon.assignee?.full_name || "Unassigned"}
                </td>
                <td className="px-4 py-2">
                  {coupon.assigned_at
                    ? new Date(coupon.assigned_at).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {!coupon.assigned_to && (
                    <Button variant="outline" size="sm">
                      Assign
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};