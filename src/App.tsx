import { Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/public";
import { adminRoutes } from "./routes/admin";
import { mentorRoutes } from "./routes/mentor";
import { participantRoutes } from "./routes/participant";
import { authRoutes } from "./routes/auth";
import Index from "./pages/Index";
import MentorsPage from "./pages/public/mentors/MentorsPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {authRoutes}
      {publicRoutes}
      {mentorRoutes}
      {participantRoutes}
      {adminRoutes}
      <Route path="/mentors" element={<MentorsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;