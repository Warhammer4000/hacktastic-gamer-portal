import { toast } from "sonner";
import type { ProfileFormValues } from "@/hooks/useMentorProfile";

export async function validateProfiles(values: ProfileFormValues) {
  try {
    // Validate GitHub username
    if (!values.github_username?.trim()) {
      toast.error("GitHub username cannot be empty");
      return false;
    }

    const githubResponse = await fetch(`https://api.github.com/users/${values.github_username.trim()}`);
    if (!githubResponse.ok) {
      toast.error("GitHub username not found");
      return false;
    }

    // Validate LinkedIn profile ID (basic format validation)
    if (!values.linkedin_profile_id?.trim()) {
      toast.error("LinkedIn profile ID cannot be empty");
      return false;
    }

    const linkedinRegex = /^[a-zA-Z0-9-]+$/;
    if (!linkedinRegex.test(values.linkedin_profile_id)) {
      toast.error("Invalid LinkedIn profile ID format");
      return false;
    }

    toast.success("Profile validation successful");
    return true;
  } catch (error) {
    console.error("Validation error:", error);
    toast.error("Validation failed. Please try again.");
    return false;
  }
}