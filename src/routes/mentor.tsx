import { Route } from "react-router-dom";
import PrivateRoute from "@/components/auth/PrivateRoute";
import MentorLayout from "@/pages/mentor/MentorLayout";
import MentorProfile from "@/pages/mentor/Profile";
import MentorDashboard from "@/pages/mentor/Dashboard";
import MentorPreferences from "@/pages/mentor/Preferences";

export const mentorRoutes = (
  <Route path="/mentor" element={<PrivateRoute><MentorLayout /></PrivateRoute>}>
    <Route index element={<MentorDashboard />} />
    <Route path="dashboard" element={<MentorDashboard />} />
    <Route path="profile" element={<MentorProfile />} />
    <Route path="preferences" element={<MentorPreferences />} />
  </Route>
);