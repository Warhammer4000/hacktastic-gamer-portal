import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function TechnologyStacks() {
  const { data: techStacks, isLoading } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Loading Technology Stacks...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-gray-900 dark:text-white uppercase mb-4">Technology Stacks</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center">
          {techStacks?.map((tech) => (
            <div
              key={tech.id}
              className="w-full max-w-[200px] h-20 flex items-center justify-center group transition-transform duration-300 hover:scale-110"
            >
              <img
                src={tech.icon_url}
                alt={tech.name}
                className="max-w-full max-h-full object-contain filter dark:brightness-0 dark:invert transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}