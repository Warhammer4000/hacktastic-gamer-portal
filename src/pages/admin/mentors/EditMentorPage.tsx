import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MentorProfileForm } from "@/components/mentor/profile/MentorProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EditMentorPage() {
  const { mentorId } = useParams();
  const navigate = useNavigate();

  const { data: mentor, isLoading } = useQuery({
    queryKey: ['mentor', mentorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mentorId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(values)
        .eq('id', mentorId);

      if (error) throw error;
      toast.success('Mentor profile updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating mentor:', error);
      toast.error('Failed to update mentor profile');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!mentor) {
    return <div>Mentor not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <h1 className="text-2xl font-bold">Edit Mentor Profile</h1>
      </div>
      <MentorProfileForm
        defaultValues={mentor}
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    </div>
  );
}