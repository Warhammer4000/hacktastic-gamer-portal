import { Github, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Mentor } from "../types";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="group overflow-hidden relative w-[240px]">
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
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-3xl text-gray-400">
              {mentor.full_name?.charAt(0) || '?'}
            </span>
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
      <div className="p-3 bg-white">
        <h2 className="text-base font-semibold text-gray-900">
          {mentor.full_name}
        </h2>
        {mentor.bio && (
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
            {mentor.bio}
          </p>
        )}
      </div>
    </Card>
  );
}