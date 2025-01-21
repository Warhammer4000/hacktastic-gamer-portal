import { Github, Linkedin, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Mentor } from "../types";

interface MentorCardProps {
  mentor: Mentor;
}

const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?backgroundColor=b6e3f4";

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="group overflow-hidden relative w-full">
      {/* Social Links - Floating on top right */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
        {mentor.linkedin_profile_id && (
          <a
            href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors duration-200 text-blue-600"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        )}
        {mentor.github_username && (
          <a
            href={`https://github.com/${mentor.github_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 hover:bg-white p-1.5 rounded-full transition-colors duration-200 text-gray-800"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Main Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {mentor.avatar_url ? (
          <img
            src={mentor.avatar_url}
            alt={mentor.full_name || "Mentor"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Gradient Overlay and Tech Stacks */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
          {mentor.mentor_tech_stacks && mentor.mentor_tech_stacks.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {mentor.mentor_tech_stacks.map((tech) => (
                tech.technology_stacks && (
                  <Badge 
                    key={tech.id} 
                    className="bg-white text-black flex items-center gap-1 py-0.5 hover:bg-white/90"
                  >
                    {tech.technology_stacks.icon_url && (
                      <img 
                        src={tech.technology_stacks.icon_url} 
                        alt={tech.technology_stacks.name}
                        className="w-3 h-3"
                        loading="lazy"
                      />
                    )}
                    <span className="text-[10px]">
                      {tech.technology_stacks.name}
                    </span>
                  </Badge>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Name in white background */}
      <div className="p-3 bg-white dark:bg-gray-800">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {mentor.full_name}
        </h2>
        {mentor.bio && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
            {mentor.bio}
          </p>
        )}
      </div>
    </Card>
  );
}