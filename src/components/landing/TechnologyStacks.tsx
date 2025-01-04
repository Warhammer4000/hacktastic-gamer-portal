import { useQuery } from "@tanstack/react-query";
import { Circuit, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TechnologyStacks() {
  const { data: stacks, isLoading } = useQuery({
    queryKey: ["technology-stacks"],
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
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Loading Technology Stacks...</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stacks?.map((stack) => (
            <Card key={stack.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Circuit className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{stack.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={stack.icon_url}
                  alt={stack.name}
                  className="h-12 object-contain mx-auto"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}