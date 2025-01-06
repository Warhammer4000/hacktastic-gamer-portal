import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Building2, GraduationCap } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function InstitutionAnalytics() {
  const { data: universityData } = useQuery({
    queryKey: ['university-distribution'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select(`
          institutions!inner (
            id,
            name,
            type,
            logo_url
          )
        `)
        .eq('institutions.type', 'university')
        .eq('institutions.status', 'active');

      const counts = data?.reduce((acc: Record<string, number>, profile) => {
        const name = profile.institutions?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts || {})
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },
  });

  const { data: organizationData } = useQuery({
    queryKey: ['organization-distribution'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select(`
          institutions!inner (
            id,
            name,
            type,
            logo_url
          )
        `)
        .eq('institutions.type', 'organization')
        .eq('institutions.status', 'active');

      const counts = data?.reduce((acc: Record<string, number>, profile) => {
        const name = profile.institutions?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(counts || {})
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Top 5 Universities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={universityData}
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
                  {universityData?.map((entry, index) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Top 5 Organizations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={organizationData}
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
                  {organizationData?.map((entry, index) => (
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