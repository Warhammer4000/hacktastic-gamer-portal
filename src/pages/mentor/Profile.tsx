import { Loader2 } from "lucide-react";
import { MentorProfileForm } from "@/components/mentor/profile/MentorProfileForm";
import { useMentorProfile } from "@/hooks/useMentorProfile";
import { toast } from "sonner";

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

      {!profile?.is_profile_approved && (
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200">
            Your profile is pending approval from an administrator.
          </p>
        </div>
      )}
    </div>
  );
}