import { Route } from "react-router-dom";
import PrivateRoute from "@/components/auth/PrivateRoute";
import ParticipantLayout from "@/pages/participant/ParticipantLayout";
import ParticipantDashboard from "@/pages/participant/Dashboard";
import ParticipantProfile from "@/pages/participant/Profile";
import TeamPage from "@/pages/participant/Team";

export const participantRoutes = (
  <Route path="/participant">
    <Route element={<PrivateRoute><ParticipantLayout /></PrivateRoute>}>
      <Route index element={<ParticipantDashboard />} />
      <Route path="dashboard" element={<ParticipantDashboard />} />
      <Route path="profile" element={<ParticipantProfile />} />
      <Route path="team" element={<TeamPage />} />
    </Route>
  </Route>
);