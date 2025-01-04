import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Mentor } from "./types";
import Navbar from "@/components/landing/Navbar";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MentorFilters } from "./components/MentorFilters";

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);

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

  const filteredMentors = mentors?.filter((mentor) => {
    const matchesSearch = mentor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTechStack = selectedTechStacks.length === 0 || 
      mentor.tech_stacks?.some(
        (tech) => tech.technology_stack && selectedTechStacks.includes(tech.technology_stack.id)
      );

    return matchesSearch && matchesTechStack;
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="container py-8 px-4 mx-auto mt-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Our Mentors</h1>
          
          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search mentors by name or bio..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <MentorFilters
              selectedTechStacks={selectedTechStacks}
              onTechStacksChange={setSelectedTechStacks}
            />
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors?.map((mentor) => (
              <Card key={mentor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {mentor.full_name}
                      </h2>
                      {mentor.bio && (
                        <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
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
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {mentor.linkedin_profile_id && (
                      <a
                        href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                  </div>

                  {/* Tech Stacks */}
                  {mentor.tech_stacks && mentor.tech_stacks.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Tech Stack</h3>
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
      </div>
    </div>
  );
}