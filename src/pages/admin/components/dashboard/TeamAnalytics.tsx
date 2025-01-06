import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function TeamAnalytics() {
  const { data: techStackData } = useQuery({
    queryKey: ["team-tech-stacks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("teams")
        .select(`
          tech_stack:technology_stacks (
            name
          )
        `);

      const stackCounts = data?.reduce((acc: Record<string, number>, team) => {
        const stackName = team.tech_stack?.name || "Unassigned";
        acc[stackName] = (acc[stackName] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(stackCounts || {}).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Teams by Technology Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={techStackData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {techStackData?.map((entry, index) => (
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