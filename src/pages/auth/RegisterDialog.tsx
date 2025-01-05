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
import { Form, FormField } from "@/components/ui/form";
import RoleSelection from "@/components/auth/registration/RoleSelection";
import { formSchema } from "@/components/auth/registration/RegistrationForm";
import { z } from "zod";

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterDialog({ isOpen, onClose }: RegisterDialogProps) {
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
    setIsLoading(true);
    try {
      // Redirect based on role
      if (values.role === "mentor") {
        navigate("/mentor/register");
      } else {
        navigate("/participant/register");
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Join Our Community
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose how you want to participate
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              Continue
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}