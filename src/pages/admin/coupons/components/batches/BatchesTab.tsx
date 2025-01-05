import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BatchesTab = () => {
  const { toast } = useToast();

  const { data: batches, isLoading } = useQuery({
    queryKey: ["couponBatches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupon_batches")
        .select(`
          *,
          vendor:coupon_vendors(name, icon_url)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load coupon batches",
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
        <h2 className="text-xl font-semibold">Coupon Batches</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Batch
        </Button>
      </div>

      <div className="grid gap-4">
        {batches?.map((batch) => (
          <div
            key={batch.id}
            className="p-4 border rounded-lg shadow-sm dark:border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={batch.vendor.icon_url}
                  alt={batch.vendor.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{batch.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {batch.vendor.name}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Add Coupons
                </Button>
                <Button variant="outline" size="sm">
                  Assign
                </Button>
              </div>
            </div>
            {batch.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {batch.description}
              </p>
            )}
            <div className="mt-2">
              <span className="text-sm font-medium">Eligible Roles: </span>
              {batch.eligible_roles.map((role, index) => (
                <span
                  key={role}
                  className="text-sm text-gray-600 dark:text-gray-300"
                >
                  {role}
                  {index < batch.eligible_roles.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};