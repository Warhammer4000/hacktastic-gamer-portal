import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechnologyStacks() {
  const { data: techStacks, isLoading, error } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active")
        .order("name");
      
      if (error) throw error;
      return data;
    },
    // Add retry and staleTime options to improve data fetching reliability
    retry: 3,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
  });

  // Show loading skeletons while data is being fetched
  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center justify-items-center">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="w-full max-w-[240px] aspect-square p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg"
              >
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error message if data fetching fails
  if (error) {
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

  // Show empty state if no tech stacks are found
  if (!techStacks || techStacks.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              No Technology Stacks Available
            </h2>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 items-center justify-items-center">
          {techStacks.map((tech) => (
            <div
              key={tech.id}
              className="group relative w-full max-w-[240px] aspect-square p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <img
                  src={tech.icon_url}
                  alt={tech.name}
                  className="w-full h-3/4 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white uppercase">
                  {tech.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}