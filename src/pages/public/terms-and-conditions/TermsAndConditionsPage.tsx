import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsAndConditionsPage() {
  const { data: termsAndConditions, isLoading } = useQuery({
    queryKey: ['terms-and-conditions'],
    queryFn: async () => {
      console.log('Fetching terms and conditions...');
      const { data, error } = await supabase
        .from('terms_and_conditions')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching terms:', error);
        throw error;
      }
      
      console.log('Terms and conditions response:', { data, error });
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!termsAndConditions) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">No terms and conditions have been published yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        <div className="text-sm text-gray-600 mb-6">
          Version {termsAndConditions.version} • Published on{" "}
          {new Date(termsAndConditions.published_at).toLocaleDateString()}
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] rounded-md border p-6">
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: termsAndConditions.content }}
          />
        </ScrollArea>
      </div>
    </div>
  );
}