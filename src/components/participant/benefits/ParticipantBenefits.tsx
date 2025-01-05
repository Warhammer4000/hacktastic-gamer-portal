import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Gift, Award, Trophy } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { CouponBenefit } from "@/components/mentor/benefits/CouponBenefit";

export function ParticipantBenefits() {
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['participant-coupons'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: coupons, error } = await supabase
        .from('coupons')
        .select(`
          id,
          code,
          assigned_at,
          state,
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

  const generalBenefits = [
    {
      icon: Gift,
      title: "Exclusive Rewards",
      description: "Access to special rewards and perks for active participants.",
    },
    {
      icon: Award,
      title: "Skill Development",
      description: "Opportunities to learn and grow through hands-on experience.",
    },
    {
      icon: Trophy,
      title: "Recognition",
      description: "Get recognized for your achievements and contributions.",
    },
  ];

  if (isLoading) {
    return <div className="p-4">Loading benefits...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {generalBenefits.map((benefit, index) => (
          <Card key={index} className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{benefit.title}</h3>
            </div>
            <p className="text-muted-foreground">{benefit.description}</p>
          </Card>
        ))}
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