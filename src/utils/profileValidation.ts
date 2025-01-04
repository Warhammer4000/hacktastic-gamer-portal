import { toast } from "sonner";
import type { ProfileFormValues } from "@/hooks/useMentorProfile";

export async function validateProfiles(values: ProfileFormValues) {
  try {
    // Validate GitHub username
    if (values.github_username?.trim()) {
      const githubResponse = await fetch(`https://api.github.com/users/${values.github_username.trim()}`);
      if (!githubResponse.ok) {
        return false;
      }
    }

    // Validate LinkedIn profile ID (basic format validation)
    if (values.linkedin_profile_id?.trim()) {
      const linkedinRegex = /^[a-zA-Z0-9-]+$/;
      if (!linkedinRegex.test(values.linkedin_profile_id)) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}