import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import RoleSelection from "@/components/auth/registration/RoleSelection";
import RegistrationForm, { formSchema } from "@/components/auth/registration/RegistrationForm";
import { z } from "zod";

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterDialog({ isOpen, onClose }: RegisterDialogProps) {
  const [step, setStep] = useState<"role" | "credentials">("role");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "participant",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (step === "role") {
      setStep("credentials");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: values.role,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([
            { user_id: data.user?.id, role: values.role }
          ]);

        if (roleError) {
          toast.error("Error setting user role");
          return;
        }

        toast.success("Registration successful! Please check your email to verify your account.");
        onClose();
        
        if (values.role === "mentor") {
          navigate("/mentor/dashboard");
        } else {
          navigate("/participant/dashboard");
        }
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStep("role");
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === "role" ? "Join Our Community" : "Create Your Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === "role" 
              ? "Choose how you want to participate"
              : "Enter your details to create an account"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === "role" ? (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <RoleSelection
                    selectedRole={field.value}
                    onRoleSelect={field.onChange}
                  />
                )}
              />
            ) : (
              <RegistrationForm form={form} />
            )}

            <div className="flex justify-between">
              {step === "credentials" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("role")}
                >
                  Back
                </Button>
              )}
              <Button 
                type="submit" 
                className={step === "role" ? "w-full" : "ml-auto"} 
                disabled={isLoading}
              >
                {step === "role" 
                  ? "Continue" 
                  : isLoading 
                    ? "Creating account..." 
                    : "Create account"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}