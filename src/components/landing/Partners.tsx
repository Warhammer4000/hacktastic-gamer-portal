import { useQuery } from "@tanstack/react-query";
import { Building, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Partners() {
  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("status", "active")
        .order("sort_order");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="heading-lg mb-4">Loading Partners...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="heading-lg mb-4">Our Partners</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Collaborating with industry leaders to drive innovation
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners?.map((partner) => (
            <Card 
              key={partner.id} 
              className="group hover:shadow-xl transition-all duration-300 border-none bg-white/50 backdrop-blur-sm dark:bg-gray-800/50"
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={partner.icon_url}
                      alt={partner.name}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center group-hover:text-primary transition-colors duration-300">
                    {partner.name}
                  </h3>
                  <Button 
                    variant="outline" 
                    className="group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                    asChild
                  >
                    <a
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}