import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MentorProfileForm } from "@/components/mentor/profile/MentorProfileForm";
import { toast } from "sonner";

export default function EditMentorPage() {
  const { mentorId } = useParams();

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
      <h1 className="text-2xl font-bold mb-6">Edit Mentor Profile</h1>
      <MentorProfileForm
        defaultValues={mentor}
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    </div>
  );
}