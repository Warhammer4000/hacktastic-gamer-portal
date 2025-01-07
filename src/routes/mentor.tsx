import { Route } from "react-router-dom";
import MentorLayout from "@/pages/mentor/MentorLayout";
import MentorDashboard from "@/pages/mentor/Dashboard";
import Profile from "@/pages/mentor/Profile";
import Preferences from "@/pages/mentor/Preferences";
import Benefits from "@/pages/mentor/Benefits";
import Mentees from "@/pages/mentor/Mentees";
import Messages from "@/pages/mentor/Messages";

export const mentorRoutes = (
  <Route path="/mentor">
    <Route element={<MentorLayout />}>
      <Route path="dashboard" element={<MentorDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="preferences" element={<Preferences />} />
      <Route path="benefits" element={<Benefits />} />
      <Route path="mentees" element={<Mentees />} />
      <Route path="messages" element={<Messages />} />
    </Route>
  </Route>
);