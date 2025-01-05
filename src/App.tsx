import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { adminRoutes } from "./routes/admin";
import { mentorRoutes } from "./routes/mentor";
import { participantRoutes } from "./routes/participant";
import { publicRoutes } from "./routes/public";
import { authRoutes } from "./routes/auth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {authRoutes}
      {adminRoutes}
      {mentorRoutes}
      {participantRoutes}
      {publicRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;