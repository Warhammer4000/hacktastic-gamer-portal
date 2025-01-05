import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound, Lightbulb } from "lucide-react";

interface RegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["participant", "mentor"])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

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
        // Insert the user role
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
        
        // Redirect based on role
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
                  <FormItem className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card 
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          field.value === "participant" ? "border-primary" : ""
                        }`}
                        onClick={() => field.onChange("participant")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <UserRound className="h-5 w-5" />
                            Participant
                          </CardTitle>
                          <CardDescription>
                            Join as a participant to learn and grow
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Access to learning materials</li>
                            <li>Participate in workshops</li>
                            <li>Connect with mentors</li>
                            <li>Track your progress</li>
                          </ul>
                        </CardContent>
                      </Card>

                      <Card 
                        className={`cursor-pointer hover:border-primary transition-colors ${
                          field.value === "mentor" ? "border-primary" : ""
                        }`}
                        onClick={() => field.onChange("mentor")}
                      >
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5" />
                            Mentor
                          </CardTitle>
                          <CardDescription>
                            Share your knowledge and guide others
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Guide participants</li>
                            <li>Share your expertise</li>
                            <li>Create learning content</li>
                            <li>Build your network</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </FormItem>
                )}
              />
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email" 
                          {...field} 
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Create a password" 
                          {...field} 
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
                          {...field} 
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
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
              <Button type="submit" className={step === "role" ? "w-full" : "ml-auto"} disabled={isLoading}>
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