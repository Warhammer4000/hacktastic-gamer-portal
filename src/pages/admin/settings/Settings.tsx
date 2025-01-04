import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegistrationSettings } from "./sections/RegistrationSettings";
import { GitHubSettings } from "./sections/GitHubSettings";
import { PlatformSettings } from "./sections/PlatformSettings";

const AdminSettings = () => {
  const navigate = useNavigate();

  // Check if user is admin
  const { data: userRole, isLoading } = useQuery({
    queryKey: ["adminCheck"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      return roles?.role;
    },
  });

  useEffect(() => {
    if (!isLoading && userRole !== "admin") {
      navigate("/");
    }
  }, [userRole, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue="registration" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <RegistrationSettings />
        </TabsContent>
        
        <TabsContent value="github">
          <GitHubSettings />
        </TabsContent>

        <TabsContent value="platform">
          <PlatformSettings />
        </TabsContent>

        <TabsContent value="security">
          <div className="text-muted-foreground">
            Security settings coming soon...
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <div className="text-muted-foreground">
            Notification settings coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;