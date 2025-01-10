import { Route } from "react-router-dom";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Profile from "@/pages/admin/Profile";
import GalleryPage from "@/pages/admin/gallery/GalleryPage";
import NewsPage from "@/pages/admin/news/NewsPage";
import EventsPage from "@/pages/admin/events/EventsPage";
import TeamsPage from "@/pages/admin/teams/TeamsPage";
import MentorApproval from "@/pages/admin/mentors/MentorApproval";
import EditMentorPage from "@/pages/admin/mentors/EditMentorPage";
import Platform from "@/pages/admin/platform/Platform";
import UsersPage from "@/pages/admin/users/UsersPage";
import EditParticipantPage from "@/pages/admin/users/EditParticipantPage";
import CouponsPage from "@/pages/admin/coupons/CouponsPage";
import Settings from "@/pages/admin/settings/Settings";
import SessionsPage from "@/pages/admin/sessions/SessionsPage";

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="profile" element={<Profile />} />
    <Route path="gallery" element={<GalleryPage />} />
    <Route path="news" element={<NewsPage />} />
    <Route path="events" element={<EventsPage />} />
    <Route path="teams" element={<TeamsPage />} />
    <Route path="mentors" element={<MentorApproval />} />
    <Route path="mentors/edit/:mentorId" element={<EditMentorPage />} />
    <Route path="platform" element={<Platform />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="users/participants/edit/:participantId" element={<EditParticipantPage />} />
    <Route path="coupons" element={<CouponsPage />} />
    <Route path="settings" element={<Settings />} />
    <Route path="sessions" element={<SessionsPage />} />
  </Route>
);