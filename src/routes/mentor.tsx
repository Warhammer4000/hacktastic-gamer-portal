import { Route } from "react-router-dom";
import PrivateRoute from "@/components/auth/PrivateRoute";
import MentorLayout from "@/pages/mentor/MentorLayout";
import MentorDashboard from "@/pages/mentor/Dashboard";
import MentorProfile from "@/pages/mentor/Profile";
import MentorPreferences from "@/pages/mentor/Preferences";
import MentorBenefits from "@/pages/mentor/Benefits";
import MentorMentees from "@/pages/mentor/Mentees";
import MentorMessages from "@/pages/mentor/Messages";

export const mentorRoutes = (
  <Route path="/mentor">
    <Route element={<PrivateRoute><MentorLayout /></PrivateRoute>}>
      <Route index element={<MentorDashboard />} />
      <Route path="dashboard" element={<MentorDashboard />} />
      <Route path="profile" element={<MentorProfile />} />
      <Route path="preferences" element={<MentorPreferences />} />
      <Route path="benefits" element={<MentorBenefits />} />
      <Route path="mentees" element={<MentorMentees />} />
      <Route path="messages" element={<MentorMessages />} />
    </Route>
  </Route>
);