import * as z from "zod";

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon_url: z.string().url("Must be a valid URL"),
  website_url: z.string().url("Must be a valid URL"),
});