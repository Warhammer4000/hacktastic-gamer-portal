import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Code } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface TeamMembersCount {
  count: number;
}

interface TechnologyStack {
  name: string;
  icon_url: string;
}

interface Team {
  id: string;
  name: string;
  team_members: TeamMembersCount[];
  technology_stacks: TechnologyStack;
}

export function TeamSizeDistribution() {
  const { data: teamSizes } = useQuery({
    queryKey: ["team-size-distribution"],
    queryFn: async () => {
      const { data: teams } = await supabase
        .from("teams")
        .select(`
          id,
          team_members!inner (
            count
          ),
          technology_stacks (
            name,
            icon_url
          )
        `);

      const distribution = teams?.reduce((acc: Record<string, number>, team) => {
        const size = (team.team_members as TeamMembersCount[])[0]?.count || 0;
        acc[`${size} Members`] = (acc[`${size} Members`] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(distribution || {}).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Size Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={teamSizes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {teamSizes?.map((entry, index) => (
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
  );
}