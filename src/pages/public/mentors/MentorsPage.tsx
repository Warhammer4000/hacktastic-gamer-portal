import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Mentor } from "./types";

export default function MentorsPage() {
  const { data: mentors, isLoading } = useQuery({
    queryKey: ["public-mentors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          avatar_url,
          bio,
          linkedin_profile_id,
          github_username,
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
        .returns<Mentor[]>();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading mentors...</div>;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Our Mentors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors?.map((mentor) => (
          <div
            key={mentor.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              {mentor.avatar_url && (
                <img
                  src={mentor.avatar_url}
                  alt={mentor.full_name || "Mentor"}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{mentor.full_name}</h2>
                {mentor.bio && (
                  <p className="text-gray-600 dark:text-gray-300">{mentor.bio}</p>
                )}
              </div>
            </div>
            {mentor.mentor_tech_stacks && mentor.mentor_tech_stacks.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.mentor_tech_stacks.map((tech) => (
                    <div
                      key={tech.id}
                      className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tech.technology_stack?.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}