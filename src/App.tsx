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
import PublicLayout from "@/pages/public/PublicLayout";
import NewsPage from "@/pages/public/news/NewsPage";
import NewsDetailPage from "@/pages/public/news/NewsDetailPage";
import GalleryPage from "@/pages/public/gallery/GalleryPage";
import FAQPage from "@/pages/public/faq/FAQPage";
import ParticipantLayout from "@/pages/participant/ParticipantLayout";
import ParticipantDashboard from "@/pages/participant/Dashboard";
import ParticipantProfile from "@/pages/participant/Profile";
import TeamPage from "@/pages/participant/Team";

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

      {/* Participant Routes */}
      <Route path="participant" element={<ParticipantLayout />}>
        <Route path="dashboard" element={<ParticipantDashboard />} />
        <Route path="profile" element={<ParticipantProfile />} />
        <Route path="team" element={<TeamPage />} />
      </Route>

      {/* Public Routes */}
      <Route path="/public" element={<PublicLayout />}>
        <Route path="mentors" element={<MentorsPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:id" element={<NewsDetailPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="faq" element={<FAQPage />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;