import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddSocialMediaLink } from "./AddSocialMediaLink";
import { SocialMediaList } from "./SocialMediaList";

export const SocialMediaTab = () => {
  const { toast } = useToast();

  const { data: socialLinks, isLoading } = useQuery({
    queryKey: ["socialMediaLinks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media_links")
        .select("*")
        .order("platform");

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load social media links",
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
        <h2 className="text-xl font-semibold">Social Media Links</h2>
        <AddSocialMediaLink />
      </div>
      <SocialMediaList links={socialLinks || []} />
    </div>
  );
};