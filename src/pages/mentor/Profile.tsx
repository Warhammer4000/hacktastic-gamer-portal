import { Loader2 } from "lucide-react";
import { MentorProfileForm } from "@/components/mentor/profile/MentorProfileForm";
import { MentorPreferences } from "@/components/mentor/profile/preferences/MentorPreferences";
import { useMentorProfile } from "@/hooks/useMentorProfile";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function MentorProfile() {
  const { profile, isLoading, updateProfile } = useMentorProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (values: any) => {
    toast.promise(updateProfile.mutateAsync(values), {
      loading: 'Saving profile...',
      success: 'Profile saved successfully!',
      error: (error) => `Failed to save profile: ${error.message}`
    });
  };

  const renderStatusMessage = () => {
    switch (profile?.status) {
      case 'pending_approval':
        return (
          <Alert className="mt-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your profile is pending approval from an administrator.
            </AlertDescription>
          </Alert>
        );
      case 'approved':
        return (
          <Alert className="mt-8" variant="default">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Your profile has been approved.
            </AlertDescription>
          </Alert>
        );
      case 'flagged':
        return (
          <Alert className="mt-8" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your profile has been flagged. Please contact an administrator.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Mentor Profile</h1>
      
      <MentorProfileForm
        defaultValues={{
          full_name: profile?.full_name || "",
          avatar_url: profile?.avatar_url || "",
          linkedin_profile_id: profile?.linkedin_profile_id || "",
          github_username: profile?.github_username || "",
          email: profile?.email || "",
        }}
        onSubmit={handleSubmit}
        isSubmitting={updateProfile.isPending}
      />

      {renderStatusMessage()}

      <Separator className="my-8" />

      <MentorPreferences />
    </div>
  );
}