import { Github, Linkedin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Mentor } from "../types";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="group overflow-hidden relative">
      {/* Social Links - Floating on top right */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {mentor.linkedin_profile_id && (
          <a
            href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors duration-200 text-blue-600"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
        {mentor.github_username && (
          <a
            href={`https://github.com/${mentor.github_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors duration-200 text-gray-800"
          >
            <Github className="h-5 w-5" />
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
            <span className="text-4xl text-gray-400">
              {mentor.full_name?.charAt(0) || '?'}
            </span>
          </div>
        )}

        {/* Gradient Overlay and Tech Stacks */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
          {mentor.mentor_tech_stacks && mentor.mentor_tech_stacks.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {mentor.mentor_tech_stacks.map((tech) => (
                tech.technology_stacks && (
                  <Badge 
                    key={tech.id} 
                    className="bg-white text-black flex items-center gap-1.5 py-1 hover:bg-white/90"
                  >
                    {tech.technology_stacks.icon_url && (
                      <img 
                        src={tech.technology_stacks.icon_url} 
                        alt={tech.technology_stacks.name}
                        className="w-4 h-4"
                      />
                    )}
                    <span className="text-xs">
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
      <div className="p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">
          {mentor.full_name}
        </h2>
        {mentor.bio && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {mentor.bio}
          </p>
        )}
      </div>
    </Card>
  );
}