import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  expertise: z
    .string()
    .min(10, "Please provide more details about your expertise")
    .max(500, "Expertise description is too long"),
});

export default function MentorRegister() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch registration settings
  const { data: registrationSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["registrationSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registration_settings")
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Check if registration is currently allowed
  const isRegistrationAllowed = registrationSettings?.mentor_registration_enabled && 
    (!registrationSettings?.mentor_registration_start || new Date(registrationSettings.mentor_registration_start) <= new Date()) &&
    (!registrationSettings?.mentor_registration_end || new Date(registrationSettings.mentor_registration_end) >= new Date());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      expertise: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    return (
      <div className="container max-w-md mx-auto mt-20 p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Registration Closed</h1>
        <p className="text-muted-foreground mb-6">
          Mentor registration is currently not available. Please check back later.
        </p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Expertise</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your experience and areas of expertise..."
                    className="min-h-[100px]"
                    {...field}
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          </p>
        </form>
      </Form>
    </div>
  );
}