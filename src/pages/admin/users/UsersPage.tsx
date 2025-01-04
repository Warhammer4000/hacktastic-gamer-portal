import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsers from "./components/AdminUsers";
import MentorUsers from "./components/MentorUsers";
import ParticipantUsers from "./components/ParticipantUsers";

export default function UsersPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <Tabs defaultValue="admins">
        <TabsList>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>
        <TabsContent value="admins">
          <AdminUsers />
        </TabsContent>
        <TabsContent value="mentors">
          <MentorUsers />
        </TabsContent>
        <TabsContent value="participants">
          <ParticipantUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}