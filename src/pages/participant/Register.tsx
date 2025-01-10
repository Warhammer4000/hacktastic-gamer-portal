import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RegistrationForm, { formSchema, RegistrationFormData } from "@/components/auth/registration/RegistrationForm";
import { RegistrationStatus } from "@/components/participant/registration/RegistrationStatus";

export default function Register() {
  const navigate = useNavigate();
  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "participant" as const,
    },
  });

  const onSubmit = async (values: RegistrationFormData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: values.role,
          },
        },
      });

      if (error) throw error;

      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
    }
  };

  return (
    <RegistrationStatus>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create Participant Account</h1>
            <p className="text-muted-foreground">Sign up to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <RegistrationForm form={form} />
              <Button type="submit" className="w-full">
                Create account
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </RegistrationStatus>
  );
}