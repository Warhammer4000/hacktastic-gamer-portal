import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export function SystemHealth() {
  const { data: registrationSettings } = useQuery({
    queryKey: ["registration-settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("registration_settings")
        .select("*")
        .single();
      return data;
    },
  });

  const { data: pendingMentors } = useQuery({
    queryKey: ["pending-mentors"],
    queryFn: async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending_approval");
      return count;
    },
  });

  const getRegistrationStatus = (enabled: boolean) => {
    if (enabled) {
      return {
        label: "Active",
        color: "bg-green-500",
        icon: CheckCircle2,
      };
    }
    return {
      label: "Inactive",
      color: "bg-red-500",
      icon: AlertCircle,
    };
  };

  const registrationTypes = [
    {
      title: "Participant Registration",
      status: getRegistrationStatus(registrationSettings?.participant_registration_enabled || false),
    },
    {
      title: "Mentor Registration",
      status: getRegistrationStatus(registrationSettings?.mentor_registration_enabled || false),
    },
    {
      title: "Admin Registration",
      status: getRegistrationStatus(registrationSettings?.admin_registration_enabled || false),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Registration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {registrationTypes.map((type) => (
              <div
                key={type.title}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium">{type.title}</span>
                <Badge
                  variant="secondary"
                  className={`${type.status.color} text-white`}
                >
                  <type.status.icon className="mr-1 h-3 w-3" />
                  {type.status.label}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mentor Approvals</span>
              <Badge variant="secondary" className="bg-yellow-500 text-white">
                <Clock className="mr-1 h-3 w-3" />
                {pendingMentors || 0} Pending
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}