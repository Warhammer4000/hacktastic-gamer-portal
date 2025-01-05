import { Route } from "react-router-dom";
import MentorLayout from "@/pages/mentor/MentorLayout";
import MentorDashboard from "@/pages/mentor/Dashboard";
import Profile from "@/pages/mentor/Profile";
import Preferences from "@/pages/mentor/Preferences";
import Register from "@/pages/mentor/Register";
import Benefits from "@/pages/mentor/Benefits";

export const mentorRoutes = (
  <Route path="/mentor">
    <Route path="register" element={<Register />} />
    <Route element={<MentorLayout />}>
      <Route path="dashboard" element={<MentorDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="preferences" element={<Preferences />} />
      <Route path="benefits" element={<Benefits />} />
    </Route>
  </Route>
);