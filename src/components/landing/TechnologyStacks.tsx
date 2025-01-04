import { useQuery } from "@tanstack/react-query";
import { Code } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export default function TechnologyStacks() {
  const { data: stacks, isLoading } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active")
        .order("name");
      
      if (error) {
        console.error("Error fetching tech stacks:", error);
        throw error;
      }
      console.log("Fetched tech stacks:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Loading Technology Stacks...</h2>
          </div>
        </div>
      </section>
    );
  }

  if (!stacks || stacks.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Technology Stacks</h2>
            <p className="text-gray-600 dark:text-gray-400">
              No technology stacks available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Technology Stacks</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore the cutting-edge technologies we support
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stacks?.map((stack) => (
            <Card 
              key={stack.id} 
              className="group hover:shadow-lg transition-all duration-300 border-none bg-white/50 backdrop-blur-sm dark:bg-gray-800/50"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={stack.icon_url}
                      alt={stack.name}
                      className="h-10 w-10 object-contain"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center group-hover:text-primary transition-colors duration-300">
                    {stack.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}