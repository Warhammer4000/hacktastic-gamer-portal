import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Globe, FileText } from "lucide-react";

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  website: Globe,
  medium: FileText,
};

export default function Footer() {
  const { data: socialLinks } = useQuery({
    queryKey: ["social-media-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_media_links")
        .select("*")
        .eq("status", "active");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">HackathonHub</h3>
            <p className="text-gray-400">
              Where innovation meets competition. Join our community of developers
              and creators.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/mentors" className="hover:text-white transition-colors">
                  Mentors
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link to="/public/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/public/terms-and-conditions" className="hover:text-white transition-colors">
                  Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-white transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              {socialLinks?.map((link) => {
                const Icon = socialIcons[link.platform as keyof typeof socialIcons];
                return (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className="hover:text-white transition-colors flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 HackathonHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}