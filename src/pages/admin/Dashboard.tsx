import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewStats } from "./components/dashboard/OverviewStats";
import { TeamAnalytics } from "./components/dashboard/TeamAnalytics";
import { MentorInsights } from "./components/dashboard/MentorInsights";
import { ParticipantAnalytics } from "./components/dashboard/ParticipantAnalytics";
import { SystemHealth } from "./components/dashboard/SystemHealth";
import { RegistrationAnalytics } from "./components/dashboard/RegistrationAnalytics";

const AdminDashboard = () => {
  return (
    <div className="container space-y-8 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Overview Statistics */}
      <OverviewStats />

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="registration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="registration" className="space-y-4">
          <RegistrationAnalytics />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <TeamAnalytics />
        </TabsContent>

        <TabsContent value="mentors" className="space-y-4">
          <MentorInsights />
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <ParticipantAnalytics />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemHealth />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;