import { Route } from "react-router-dom";
import ParticipantRegister from "@/pages/participant/Register";
import MentorRegister from "@/pages/mentor/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

export const authRoutes = [
  <Route key="participant-register" path="/participant/register" element={<ParticipantRegister />} />,
  <Route key="mentor-register" path="/mentor/register" element={<MentorRegister />} />,
  <Route key="forgot-password" path="/forgot-password" element={<ForgotPassword />} />,
  <Route key="reset-password" path="/reset-password" element={<ResetPassword />} />
];