import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VendorsTab = () => {
  const { toast } = useToast();

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["couponVendors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupon_vendors")
        .select("*")
        .order("name");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load vendors",
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
        <h2 className="text-xl font-semibold">Coupon Vendors</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vendors?.map((vendor) => (
          <div
            key={vendor.id}
            className="p-4 border rounded-lg shadow-sm dark:border-gray-800"
          >
            <div className="flex items-center space-x-4">
              <img
                src={vendor.icon_url}
                alt={vendor.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h3 className="font-medium">{vendor.name}</h3>
                <a
                  href={vendor.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};