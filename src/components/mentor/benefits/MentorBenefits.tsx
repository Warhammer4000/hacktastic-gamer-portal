import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CouponBenefit } from "./CouponBenefit";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

export function MentorBenefits() {
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['mentor-coupons'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: coupons, error } = await supabase
        .from('coupons')
        .select(`
          id,
          code,
          assigned_at,
          batch_id,
          coupon_batches (
            name,
            description,
            redemption_instructions,
            vendor_id,
            coupon_vendors (
              name,
              icon_url,
              website_url
            )
          )
        `)
        .eq('assigned_to', user.id)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      return coupons;
    }
  });

  if (isLoading) {
    return <div className="p-4">Loading benefits...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Your Benefits</h2>
        <p className="text-sm text-muted-foreground">
          Exclusive perks and rewards for being a mentor
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Available Coupons</h3>
        {coupons && coupons.length > 0 ? (
          <div className="grid gap-4">
            {coupons.map((coupon) => (
              <CouponBenefit key={coupon.id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <Alert>
            <AlertTitle>No coupons available</AlertTitle>
            <AlertDescription>
              You don't have any coupons assigned to you yet.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}