import { toast } from "sonner";
import type { ProfileFormValues } from "@/hooks/useMentorProfile";

export async function validateProfiles(values: ProfileFormValues) {
  try {
    // Validate GitHub username
    const githubResponse = await fetch(`https://api.github.com/users/${values.github_username}`);
    if (!githubResponse.ok) {
      toast.error("Invalid GitHub username");
      return false;
    }

    // Validate LinkedIn profile ID (basic format validation)
    const linkedinRegex = /^[a-zA-Z0-9-]+$/;
    if (!linkedinRegex.test(values.linkedin_profile_id)) {
      toast.error("Invalid LinkedIn profile ID format");
      return false;
    }

    toast.success("Profile validation successful");
    return true;
  } catch (error) {
    toast.error("Validation failed");
    return false;
  }
}