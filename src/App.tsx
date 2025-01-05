import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { adminRoutes } from "./routes/admin";
import { mentorRoutes } from "./routes/mentor";
import { participantRoutes } from "./routes/participant";
import { publicRoutes } from "./routes/public";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {adminRoutes}
      {mentorRoutes}
      {participantRoutes}
      {publicRoutes}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;