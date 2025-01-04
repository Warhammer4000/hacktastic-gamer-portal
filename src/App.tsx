import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Profile from "./pages/admin/Profile";
import Settings from "./pages/admin/settings/Settings";
import MentorApproval from "./pages/admin/mentors/MentorApproval";
import Platform from "./pages/admin/platform/Platform";
import UsersPage from "./pages/admin/users/UsersPage";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/Register";
import ParticipantRegister from "./pages/participant/Register";
import MentorRegister from "./pages/mentor/Register";
import MentorLayout from "./pages/mentor/MentorLayout";
import MentorProfile from "./pages/mentor/Profile";
import MentorDashboard from "./pages/mentor/Dashboard";
import MentorPreferences from "./pages/mentor/Preferences";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/auth/PrivateRoute";
import MentorsPage from "./pages/public/mentors/MentorsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />}>
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/participant/register" element={<ParticipantRegister />} />
      <Route path="/mentor/register" element={<MentorRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/public/mentors" element={<MentorsPage />} />
      <Route path="/mentors" element={<MentorsPage />} />
      
      <Route path="/mentor" element={<PrivateRoute><MentorLayout /></PrivateRoute>}>
        <Route index element={<MentorDashboard />} />
        <Route path="dashboard" element={<MentorDashboard />} />
        <Route path="profile" element={<MentorProfile />} />
        <Route path="preferences" element={<MentorPreferences />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="mentors" element={<MentorApproval />} />
        <Route path="platform" element={<Platform />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;