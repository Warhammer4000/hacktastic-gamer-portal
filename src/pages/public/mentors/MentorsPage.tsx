import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Mentor } from "./types";

export default function MentorsPage() {
  const { data: mentors, isLoading } = useQuery({
    queryKey: ["public-mentors"],
    queryFn: async () => {
      // First, get approved mentor profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          email,
          avatar_url,
          bio,
          linkedin_profile_id,
          github_username,
          status
        `)
        .eq("status", "approved");

      if (profilesError) throw profilesError;

      // Then, get tech stacks for these mentors
      const { data: techStacks, error: techStacksError } = await supabase
        .from("mentor_tech_stacks")
        .select(`
          id,
          mentor_id,
          tech_stack_id,
          technology_stacks (
            id,
            name,
            icon_url
          )
        `)
        .in(
          "mentor_id",
          profiles?.map((profile) => profile.id) ?? []
        );

      if (techStacksError) throw techStacksError;

      // Combine the data
      const mentorsWithTechStacks = profiles?.map((profile) => ({
        ...profile,
        tech_stacks: techStacks.filter(
          (stack) => stack.mentor_id === profile.id
        ),
      }));

      return mentorsWithTechStacks as Mentor[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Our Mentors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors?.map((mentor) => (
          <Card key={mentor.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {mentor.avatar_url && (
                  <img
                    src={mentor.avatar_url}
                    alt={mentor.full_name || "Mentor"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{mentor.full_name}</h2>
                  {mentor.bio && (
                    <p className="text-muted-foreground mt-1 line-clamp-2">
                      {mentor.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-2 mt-4">
                {mentor.github_username && (
                  <a
                    href={`https://github.com/${mentor.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {mentor.linkedin_profile_id && (
                  <a
                    href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>

              {/* Tech Stacks */}
              {mentor.tech_stacks && mentor.tech_stacks.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.tech_stacks.map((tech) => (
                      tech.technology_stack && (
                        <Badge key={tech.id} variant="secondary">
                          {tech.technology_stack.name}
                        </Badge>
                      )
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}