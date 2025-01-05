import { Route } from "react-router-dom";
import PublicLayout from "@/pages/public/PublicLayout";
import MentorsPage from "@/pages/public/mentors/MentorsPage";
import NewsPage from "@/pages/public/news/NewsPage";
import NewsDetailPage from "@/pages/public/news/NewsDetailPage";
import GalleryPage from "@/pages/public/gallery/GalleryPage";
import FAQPage from "@/pages/public/faq/FAQPage";

export const publicRoutes = (
  <Route path="/public" element={<PublicLayout />}>
    <Route path="mentors" element={<MentorsPage />} />
    <Route path="news" element={<NewsPage />} />
    <Route path="news/:id" element={<NewsDetailPage />} />
    <Route path="gallery" element={<GalleryPage />} />
    <Route path="faq" element={<FAQPage />} />
  </Route>
);