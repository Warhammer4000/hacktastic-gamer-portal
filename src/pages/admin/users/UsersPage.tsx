import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminUsers from "./components/AdminUsers";
import MentorUsers from "./components/MentorUsers";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      
      <Tabs defaultValue="admins" className="w-full">
        <TabsList>
          <TabsTrigger value="admins">Administrators</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="admins">
          <AdminUsers />
        </TabsContent>
        
        <TabsContent value="mentors">
          <MentorUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}