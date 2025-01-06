import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function RegistrationAnalytics() {
  // Query for profile completion stats
  const { data: profileStats } = useQuery({
    queryKey: ["profile-completion-stats"],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("status, is_profile_completed");

      const stats = profiles?.reduce(
        (acc: Record<string, number>, profile) => {
          const status = profile.is_profile_completed ? "completed" : "incomplete";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );

      return Object.entries(stats).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  // Query for institution distribution
  const { data: institutionStats } = useQuery({
    queryKey: ["institution-stats"],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select(`
          institutions (
            name,
            type
          )
        `);

      const stats = profiles?.reduce(
        (acc: Record<string, number>, profile) => {
          const institution = profile.institutions?.name || "No Institution";
          acc[institution] = (acc[institution] || 0) + 1;
          return acc;
        },
        {}
      );

      return Object.entries(stats)
        .map(([name, value]) => ({
          name,
          value,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 institutions
    },
  });

  // Query for role distribution
  const { data: roleStats } = useQuery({
    queryKey: ["role-stats"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role");

      const stats = roles?.reduce(
        (acc: Record<string, number>, { role }) => {
          acc[role] = (acc[role] || 0) + 1;
          return acc;
        },
        {}
      );

      return Object.entries(stats).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Profile Completion Status */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profileStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {profileStats?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Institutions */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Institutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={institutionStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {institutionStats?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleStats?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}