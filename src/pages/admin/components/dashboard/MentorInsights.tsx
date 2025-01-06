import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MentorInsights() {
  const { data: mentorStats } = useQuery({
    queryKey: ["mentor-stats"],
    queryFn: async () => {
      const { data: mentors } = await supabase
        .from("profiles")
        .select(`
          *,
          mentor_tech_stacks!inner (
            technology_stacks (
              name
            )
          )
        `)
        .eq("status", "approved");

      const techStackCounts = mentors?.reduce((acc: Record<string, number>, mentor) => {
        mentor.mentor_tech_stacks?.forEach((stack) => {
          const stackName = stack.technology_stacks?.name || "Unknown";
          acc[stackName] = (acc[stackName] || 0) + 1;
        });
        return acc;
      }, {});

      return Object.entries(techStackCounts || {}).map(([name, value]) => ({
        name,
        mentors: value,
      }));
    },
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Mentor Technology Stack Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mentorStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="mentors" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}