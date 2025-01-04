import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function TechnologyStacks() {
  const { data: techStacks, isLoading } = useQuery({
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
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Loading Technology Stacks...</h2>
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
          {techStacks?.map((tech) => (
            <div
              key={tech.id}
              className="group relative w-full max-w-[240px] aspect-square p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <img
                  src={tech.icon_url}
                  alt={tech.name}
                  className="w-full h-3/4 object-contain mb-4 transition-transform duration-300 group-hover:scale-110"
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