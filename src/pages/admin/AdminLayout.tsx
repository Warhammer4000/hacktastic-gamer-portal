import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { 
  Users, 
  Settings, 
  BarChart3, 
  LogOut, 
  User, 
  UserCheck, 
  Cpu,
  GalleryHorizontal,
  Newspaper
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { Toggle } from "@/components/ui/toggle";
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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Check if user is admin
  const { data: userRole, isLoading: isRoleLoading } = useQuery({
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

  // Fetch pending mentors count
  const { data: pendingMentorsCount } = useQuery({
    queryKey: ["pendingMentorsCount"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true })
        .eq("status", "pending_approval");

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      path: "/admin/dashboard",
    },
    {
      title: "Gallery",
      icon: GalleryHorizontal,
      path: "/admin/gallery",
    },
    {
      title: "News",
      icon: Newspaper,
      path: "/admin/news",
    },
    {
      title: "Mentor Approval",
      icon: UserCheck,
      path: "/admin/mentors",
      badge: pendingMentorsCount,
    },
    {
      title: "Platform",
      icon: Cpu,
      path: "/admin/platform",
    },
    {
      title: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (!isRoleLoading && userRole !== "admin") {
      navigate("/");
    }
  }, [userRole, isRoleLoading, navigate]);

  if (isRoleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="flex items-center justify-between px-4 py-2">
                <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
                <Toggle
                  pressed={theme === "dark"}
                  onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
                  className="ml-2"
                  aria-label="Toggle theme"
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === "dark" ? "🌙" : "☀️"}
                </Toggle>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => navigate(item.path)}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          {item.badge ? (
                            <Badge variant="destructive" className="ml-2">
                              {item.badge}
                            </Badge>
                          ) : null}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  <SidebarSeparator />
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => navigate("/admin/profile")}
                        className="flex items-center gap-2 w-full"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-destructive hover:text-destructive"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;