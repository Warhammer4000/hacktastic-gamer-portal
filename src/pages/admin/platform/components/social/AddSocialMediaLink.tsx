import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Facebook, Twitter, Instagram, Youtube, Link2, FileText, Linkedin } from "lucide-react";

type SocialMediaPlatform = 'facebook' | 'twitter' | 'instagram' | 'youtube' | 'website' | 'medium' | 'linkedin';

const platforms: { value: SocialMediaPlatform; label: string; icon: JSX.Element }[] = [
  { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
  { value: "twitter", label: "X (Twitter)", icon: <Twitter className="h-4 w-4" /> },
  { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
  { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
  { value: "website", label: "Website", icon: <Link2 className="h-4 w-4" /> },
  { value: "medium", label: "Medium", icon: <FileText className="h-4 w-4" /> },
  { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
];

export const AddSocialMediaLink = () => {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<SocialMediaPlatform | ''>('');
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform) return;
    
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("social_media_links")
        .insert({ platform, url });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social media link added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["socialMediaLinks"] });
      setOpen(false);
      setPlatform('');
      setUrl("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add social media link",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Social Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Social Media Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={(value: SocialMediaPlatform) => setPlatform(value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem 
                    key={platform.value} 
                    value={platform.value}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {platform.icon}
                      <span>{platform.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://"
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Link"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};