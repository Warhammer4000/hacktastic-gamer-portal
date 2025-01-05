import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MentorsPage from "./pages/public/mentors/MentorsPage";
import NotFound from "./pages/NotFound";
import MentorLayout from "@/pages/mentor/MentorLayout";
import MentorDashboard from "@/pages/mentor/Dashboard";
import Profile from "@/pages/mentor/Profile";
import Preferences from "@/pages/mentor/Preferences";
import Register from "@/pages/mentor/Register";
import Benefits from "@/pages/mentor/Benefits";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Mentor Routes */}
      <Route path="mentor">
        <Route path="register" element={<Register />} />
        <Route element={<MentorLayout />}>
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="benefits" element={<Benefits />} />
        </Route>
      </Route>

      {/* Public Routes */}
      <Route path="/mentors" element={<MentorsPage />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;