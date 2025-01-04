import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { TechStacksGrid } from "./tech-stacks/TechStacksGrid";
import { LoadingGrid } from "./tech-stacks/LoadingGrid";

export default function TechnologyStacks() {
  const { data: techStacks, isLoading, error } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      console.log("Fetching tech stacks...");
      
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active")
        .order("name");
      
      if (error) {
        console.error("Error fetching tech stacks:", error);
        throw error;
      }
      
      console.log("Tech stacks response:", { data, error });
      return data;
    },
    retry: 3,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          </div>
          <LoadingGrid />
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Error in component:", error);
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-red-600 dark:text-red-400">
              Error Loading Technology Stacks
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Please refresh the page to try again
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!techStacks || techStacks.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              No Technology Stacks Available
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Please check back later
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
            Explore Our Tech Stacks
          </h2>
        </div>
        <TechStacksGrid techStacks={techStacks} />
      </div>
    </section>
  );
}