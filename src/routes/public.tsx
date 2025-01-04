import { Route } from "react-router-dom";
import PublicLayout from "@/pages/public/PublicLayout";
import MentorsPage from "@/pages/public/mentors/MentorsPage";
import NewsPage from "@/pages/public/news/NewsPage";
import NewsDetailPage from "@/pages/public/news/NewsDetailPage";
import PublicGalleryPage from "@/pages/public/gallery/GalleryPage";
import FAQPage from "@/pages/public/faq/FAQPage";
import PrivacyPolicyPage from "@/pages/public/privacy-policy/PrivacyPolicyPage";

export const publicRoutes = (
  <Route element={<PublicLayout />}>
    <Route path="/public/mentors" element={<MentorsPage />} />
    <Route path="/public/news" element={<NewsPage />} />
    <Route path="/public/news/:id" element={<NewsDetailPage />} />
    <Route path="/public/gallery" element={<PublicGalleryPage />} />
    <Route path="/public/faq" element={<FAQPage />} />
    <Route path="/public/privacy-policy" element={<PrivacyPolicyPage />} />
  </Route>
);