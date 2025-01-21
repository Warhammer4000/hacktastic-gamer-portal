import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import { MentorFilters } from "./components/MentorFilters";
import { MentorCard } from "./components/MentorCard";
import type { Mentor } from "./types";

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTechStacks, setSelectedTechStacks] = useState<string[]>([]);

  const { data: mentors, isLoading } = useQuery({
    queryKey: ["public-mentors"],
    queryFn: async () => {
      const { data: mentorRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "mentor");

      if (rolesError) throw rolesError;

      const mentorIds = mentorRoles.map(role => role.user_id);

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
          status,
          mentor_tech_stacks (
            id,
            tech_stack_id,
            technology_stacks (
              id,
              name,
              icon_url
            )
          )
        `)
        .eq("status", "approved")
        .in("id", mentorIds);

      if (profilesError) throw profilesError;

      return profiles as Mentor[];
    },
  });

  const filteredMentors = mentors?.filter((mentor) => {
    const matchesSearch = mentor.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         mentor.bio?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTechStack = selectedTechStacks.length === 0 || 
      mentor.mentor_tech_stacks?.some(
        (tech) => tech.technology_stacks && selectedTechStacks.includes(tech.technology_stacks.id)
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
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
            Our Mentors
          </h1>
          
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMentors?.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}