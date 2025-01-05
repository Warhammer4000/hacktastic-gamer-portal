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
import { Plus } from "lucide-react";

const platforms = [
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
  { value: "medium", label: "Medium" },
  { value: "linkedin", label: "LinkedIn" },
];

export const AddSocialMediaLink = () => {
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("social_media_links")
        .insert([{ platform, url }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Social media link added successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["socialMediaLinks"] });
      setOpen(false);
      setPlatform("");
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
            <Select value={platform} onValueChange={setPlatform} required>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    {platform.label}
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