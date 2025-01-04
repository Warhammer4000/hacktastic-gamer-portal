import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  avatar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  github_username: z.string().min(1, "GitHub username is required"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;