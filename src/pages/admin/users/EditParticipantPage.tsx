import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ParticipantProfileForm } from "@/components/participant/profile/ParticipantProfileForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function EditParticipantPage() {
  const { participantId } = useParams();
  const navigate = useNavigate();

  const { data: participant, isLoading } = useQuery({
    queryKey: ['participant', participantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', participantId)
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
        .eq('id', participantId);

      if (error) throw error;
      toast.success('Participant profile updated successfully');
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating participant:', error);
      toast.error('Failed to update participant profile');
    }
  };

  const handleBackClick = () => {
    navigate('/admin/users');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!participant) {
    return <div>Participant not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={handleBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <h1 className="text-2xl font-bold">Edit Participant Profile</h1>
      </div>
      <ParticipantProfileForm
        profile={participant}
        onSuccess={() => navigate('/admin/users')}
      />
    </div>
  );
}