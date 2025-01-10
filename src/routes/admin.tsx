import { Route } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import EditMentorPage from "@/pages/admin/mentors/EditMentorPage";
import EditParticipantPage from "@/pages/admin/users/EditParticipantPage";
import UsersPage from "@/pages/admin/users/UsersPage";

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="users" element={<UsersPage />} />
    <Route path="mentors/edit/:mentorId" element={<EditMentorPage />} />
    <Route path="participants/edit/:participantId" element={<EditParticipantPage />} />
  </Route>
);
