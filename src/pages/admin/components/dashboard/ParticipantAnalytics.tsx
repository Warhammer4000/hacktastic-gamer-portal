import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ParticipantAnalytics() {
  const { data: registrationTrends } = useQuery({
    queryKey: ["registration-trends"],
    queryFn: async () => {
      const { data: participants } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at");

      const trends = participants?.reduce((acc: Record<string, number>, participant) => {
        const date = new Date(participant.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(trends || {}).map(([date, count]) => ({
        date,
        registrations: count,
      }));
    },
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Registration Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}