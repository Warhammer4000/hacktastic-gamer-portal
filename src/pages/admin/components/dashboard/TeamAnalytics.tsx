import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Code } from "lucide-react";

interface TechStackData {
  name: string;
  value: number;
  icon_url?: string;
}

export function TeamAnalytics() {
  const { data: techStackData } = useQuery({
    queryKey: ["team-tech-stacks"],
    queryFn: async () => {
      const { data } = await supabase
        .from("teams")
        .select(`
          tech_stack:technology_stacks (
            name,
            icon_url
          )
        `);

      const stackCounts = data?.reduce((acc: Record<string, { count: number; icon_url?: string }>, team) => {
        const stackName = team.tech_stack?.name || "Unassigned";
        if (!acc[stackName]) {
          acc[stackName] = { 
            count: 0, 
            icon_url: team.tech_stack?.icon_url 
          };
        }
        acc[stackName].count += 1;
        return acc;
      }, {});

      return Object.entries(stackCounts || {}).map(([name, { count, icon_url }]) => ({
        name,
        value: count,
        icon_url
      }));
    },
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, icon_url }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        {icon_url ? (
          <image
            x={x - 12}
            y={y - 12}
            width={24}
            height={24}
            xlinkHref={icon_url}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <Code className="h-6 w-6" x={x - 12} y={y - 12} />
        )}
        <text x={x} y={y + 20} fill="#666" textAnchor="middle" dominantBaseline="middle">
          {name}
        </text>
      </g>
    );
  };

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
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
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