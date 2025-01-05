import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Eye, ExternalLink, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CouponBenefitProps {
  coupon: {
    id: string;
    code: string;
    assigned_at: string;
    coupon_batches: {
      name: string;
      description: string | null;
      redemption_instructions: string;
      coupon_vendors: {
        name: string;
        icon_url: string;
        website_url: string;
      };
    };
  };
}

export function CouponBenefit({ coupon }: CouponBenefitProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { toast } = useToast();

  const handleReveal = async () => {
    try {
      // Mark the coupon as redeemed by updating the assigned_at timestamp
      const { error } = await supabase
        .from('coupons')
        .update({ assigned_at: new Date().toISOString() })
        .eq('id', coupon.id);

      if (error) throw error;

      setIsRevealed(true);
      toast({
        title: "Coupon revealed",
        description: "Your coupon code is now visible",
      });
    } catch (error) {
      console.error('Error revealing coupon:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not reveal the coupon. Please try again.",
      });
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="h-12 w-12 rounded-lg border p-2 flex items-center justify-center">
          <img
            src={coupon.coupon_batches.coupon_vendors.icon_url}
            alt={coupon.coupon_batches.coupon_vendors.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold">
            {coupon.coupon_batches.name}
          </h4>
          <p className="text-sm text-muted-foreground">
            {coupon.coupon_batches.coupon_vendors.name}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {coupon.coupon_batches.description && (
          <p className="text-sm">{coupon.coupon_batches.description}</p>
        )}
        {isRevealed ? (
          <>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Your Coupon Code:</p>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-base font-semibold">
                {coupon.code}
              </code>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">How to redeem:</p>
              <p className="text-sm text-muted-foreground">
                {coupon.coupon_batches.redemption_instructions}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-8">
            <Button onClick={handleReveal} className="gap-2">
              <Gift className="h-4 w-4" />
              Reveal Coupon Code
            </Button>
          </div>
        )}
      </CardContent>
      {isRevealed && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full gap-2"
            asChild
          >
            <a
              href={coupon.coupon_batches.coupon_vendors.website_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Redeem Now
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}