import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useRegistrationSettings } from "@/hooks/useRegistrationSettings";
import { MentorRegistrationForm, MentorRegistrationFormData } from "@/components/mentor/registration/MentorRegistrationForm";
import { RegistrationClosed } from "@/components/mentor/registration/RegistrationClosed";

export default function MentorRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { data: registrationSettings, isLoading: isLoadingSettings } = useRegistrationSettings();

  // Add debug logs
  console.log('Registration Settings:', registrationSettings);
  
  // Check if registration is currently allowed
  const isRegistrationAllowed = registrationSettings?.mentor_registration_enabled && 
    (!registrationSettings?.mentor_registration_start || new Date(registrationSettings.mentor_registration_start) <= new Date()) &&
    (!registrationSettings?.mentor_registration_end || new Date(registrationSettings.mentor_registration_end) >= new Date());

  // Add more debug logs
  console.log('Registration enabled:', registrationSettings?.mentor_registration_enabled);
  console.log('Start date:', registrationSettings?.mentor_registration_start);
  console.log('End date:', registrationSettings?.mentor_registration_end);
  console.log('Is registration allowed:', isRegistrationAllowed);

  async function onSubmit(values: MentorRegistrationFormData) {
    if (!isRegistrationAllowed) {
      toast.error("Mentor registration is currently not available");
      return;
    }

    try {
      setIsLoading(true);
      
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            expertise: values.expertise,
          },
        },
      });

      if (signUpError) {
        toast.error(signUpError.message);
        return;
      }

      if (!user?.id) {
        toast.error("Error creating account");
        return;
      }

      // Add mentor role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: user.id,
          role: 'mentor'
        }]);

      if (roleError) {
        toast.error("Error setting user role");
        return;
      }

      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoadingSettings) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!isRegistrationAllowed) {
    return <RegistrationClosed />;
  }

  return (
    <div className="container max-w-md mx-auto mt-20 p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/register")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Registration Options
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Register as Mentor</h1>
        <p className="text-muted-foreground mt-2">
          Share your knowledge and help others grow
        </p>
      </div>

      <MentorRegistrationForm onSubmit={onSubmit} isLoading={isLoading} />

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Button
          variant="link"
          className="p-0"
          onClick={() => navigate("/login")}
        >
          Sign in
        </Button>
      </p>
    </div>
  );
}