import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Building2, Code2 } from "lucide-react";

export function OverviewStats() {
  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [
        { count: totalParticipants },
        { count: totalMentors },
        { count: totalTeams },
        { count: activeTeams },
      ] = await Promise.all([
        supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "participant"),
        supabase
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "mentor"),
        supabase
          .from("teams")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("teams")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
      ]);

      return {
        totalParticipants: totalParticipants || 0,
        totalMentors: totalMentors || 0,
        totalTeams: totalTeams || 0,
        activeTeams: activeTeams || 0,
      };
    },
  });

  const items = [
    {
      title: "Total Participants",
      value: stats?.totalParticipants || 0,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Mentors",
      value: stats?.totalMentors || 0,
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Total Teams",
      value: stats?.totalTeams || 0,
      icon: Building2,
      color: "text-purple-600",
    },
    {
      title: "Active Teams",
      value: stats?.activeTeams || 0,
      icon: Code2,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}