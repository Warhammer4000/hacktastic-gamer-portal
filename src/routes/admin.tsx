import { Route } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import Profile from "@/pages/admin/Profile";
import Settings from "@/pages/admin/settings/Settings";
import MentorApproval from "@/pages/admin/mentors/MentorApproval";
import Platform from "@/pages/admin/platform/Platform";
import UsersPage from "@/pages/admin/users/UsersPage";
import GalleryPage from "@/pages/admin/gallery/GalleryPage";
import { NewsTab } from "@/pages/admin/platform/components/news/NewsTab";
import EditMentorPage from "@/pages/admin/mentors/EditMentorPage";
import TeamsPage from "@/pages/admin/teams/TeamsPage";

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminDashboard />} />
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="gallery" element={<GalleryPage />} />
    <Route path="news" element={<NewsTab />} />
    <Route path="mentors" element={<MentorApproval />} />
    <Route path="mentors/edit/:mentorId" element={<EditMentorPage />} />
    <Route path="platform" element={<Platform />} />
    <Route path="settings" element={<Settings />} />
    <Route path="profile" element={<Profile />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="teams" element={<TeamsPage />} />
  </Route>
);