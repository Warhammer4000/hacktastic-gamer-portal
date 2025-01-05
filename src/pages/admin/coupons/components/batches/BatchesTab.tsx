import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddBatchDialog } from "./AddBatchDialog";
import { AddCouponsDialog } from "../coupons/AddCouponsDialog";
import { EditBatchDialog } from "./EditBatchDialog";
import { AssignCouponsDialog } from "./AssignCouponsDialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const BatchesTab = () => {
  const { toast } = useToast();

  const { data: vendors } = useQuery({
    queryKey: ["couponVendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupon_vendors")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: batches, isLoading } = useQuery({
    queryKey: ["couponBatches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupon_batches")
        .select(`
          *,
          vendor:coupon_vendors(name, icon_url),
          coupons(
            id,
            code,
            batch_id,
            assigned_to,
            assigned_at
          )
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

      return data?.map(batch => ({
        ...batch,
        stats: {
          total: batch.coupons.length,
          assigned: batch.coupons.filter(c => c.assigned_to).length,
          remaining: batch.coupons.filter(c => !c.assigned_to).length,
        }
      }));
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Coupon Batches</h2>
        {vendors && vendors.length > 0 ? (
          <AddBatchDialog vendors={vendors} />
        ) : (
          <div className="text-sm text-gray-500">
            Add vendors first to create batches
          </div>
        )}
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
              <div className="flex items-center space-x-2">
                <EditBatchDialog batch={batch} vendors={vendors || []} />
                <AddCouponsDialog batchId={batch.id} />
                <AssignCouponsDialog batch={batch} />
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  disabled={batch.stats.remaining === 0}
                  onClick={() => {
                    const assignButton = document.querySelector(`[data-batch-id="${batch.id}"]`);
                    if (assignButton instanceof HTMLElement) {
                      assignButton.click();
                    }
                  }}
                >
                  <Users className="h-4 w-4" />
                  <span>
                    {batch.stats.remaining === 0 
                      ? "No coupons left" 
                      : `Assign ${batch.stats.remaining} coupons`}
                  </span>
                </Button>
              </div>
            </div>
            
            {batch.description && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {batch.description}
              </p>
            )}
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Coupon Usage</span>
                <span>{batch.stats.assigned} / {batch.stats.total} assigned</span>
              </div>
              <Progress 
                value={(batch.stats.assigned / batch.stats.total) * 100} 
                className="h-2"
              />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium">{batch.stats.total}</div>
                  <div className="text-gray-500 dark:text-gray-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{batch.stats.assigned}</div>
                  <div className="text-gray-500 dark:text-gray-400">Assigned</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{batch.stats.remaining}</div>
                  <div className="text-gray-500 dark:text-gray-400">Remaining</div>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <span className="text-sm font-medium">Eligible Roles: </span>
              {batch.eligible_roles.map((role: string, index: number) => (
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