import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2 } from "lucide-react";
import { EditSocialMediaLink } from "./EditSocialMediaLink";

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  status: string;
}

export const SocialMediaList = ({ links }: { links: SocialMediaLink[] }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("social_media_links")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete social media link",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Social media link deleted successfully",
    });
    queryClient.invalidateQueries({ queryKey: ["socialMediaLinks"] });
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const { error } = await supabase
      .from("social_media_links")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["socialMediaLinks"] });
  };

  return (
    <div className="grid gap-4">
      {links.map((link) => (
        <div
          key={link.id}
          className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-800"
        >
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="font-medium capitalize">{link.platform}</h3>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                {link.url}
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={link.status === "active"}
              onCheckedChange={() => toggleStatus(link.id, link.status)}
            />
            <EditSocialMediaLink link={link} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(link.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};