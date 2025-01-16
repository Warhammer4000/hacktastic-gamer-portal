import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

interface TeamRepositoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  teamName: string;
  currentRepositoryUrl: string | null;
}

export function TeamRepositoryDialog({
  open,
  onOpenChange,
  teamId,
  teamName,
  currentRepositoryUrl,
}: TeamRepositoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentRepositoryUrl || "");
  const queryClient = useQueryClient();

  const handleManualAssignment = async () => {
    if (!manualUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }

    const githubUrlPattern = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (!githubUrlPattern.test(manualUrl)) {
      toast.error("Please enter a valid GitHub repository URL");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("teams")
        .update({ repository_url: manualUrl })
        .eq("id", teamId);

      if (error) throw error;

      toast.success("Repository URL updated successfully");
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating repository URL:", error);
      toast.error("Failed to update repository URL");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutomatedCreation = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-team-repository",
        {
          body: { teamId },
        }
      );

      if (error) throw error;

      if (!data.repository_url) {
        throw new Error("No repository URL returned");
      }

      toast.success("Repository created successfully!");
      queryClient.invalidateQueries({ queryKey: ['admin-teams'] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error("Failed to create repository");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Team Repository</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual URL</TabsTrigger>
            <TabsTrigger value="automated">Create New</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repository-url">Repository URL</Label>
                <Input
                  id="repository-url"
                  placeholder="https://github.com/org/repo"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                />
              </div>
              <Button
                onClick={handleManualAssignment}
                disabled={isSubmitting}
                className="w-full"
              >
                Save Repository URL
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="automated" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will create a new repository for team "{teamName}" and
                automatically set up permissions for team members.
              </p>
              <Button
                onClick={handleAutomatedCreation}
                disabled={isSubmitting}
                className="w-full"
              >
                Create New Repository
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {currentRepositoryUrl && (
          <div className="mt-4 p-4 border rounded-lg">
            <Label className="text-sm text-muted-foreground">
              Current Repository
            </Label>
            <a
              href={currentRepositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline block mt-1"
            >
              {currentRepositoryUrl}
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}