import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Settings, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegistrationSettings } from "./sections/RegistrationSettings";
import { GitHubSettings } from "./sections/GitHubSettings";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

// Menu items for the admin sidebar
const sidebarItems = [
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.path === "/admin/settings"}
                      >
                        <button
                          onClick={() => navigate(item.path)}
                          className="flex items-center gap-2 w-full"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
          
          <Tabs defaultValue="registration" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="registration">
              <RegistrationSettings />
            </TabsContent>
            
            <TabsContent value="github">
              <GitHubSettings />
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminSettings;