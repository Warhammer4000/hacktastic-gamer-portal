import { Github, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Mentor } from "../types";

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {mentor.avatar_url && (
            <img
              src={mentor.avatar_url}
              alt={mentor.full_name || "Mentor"}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mentor.full_name}
            </h2>
            {mentor.bio && (
              <p className="text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {mentor.bio}
              </p>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="flex gap-2 mt-4">
          {mentor.github_username && (
            <a
              href={`https://github.com/${mentor.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
          {mentor.linkedin_profile_id && (
            <a
              href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
        </div>

        {/* Tech Stacks with Icons */}
        {mentor.mentor_tech_stacks && mentor.mentor_tech_stacks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.mentor_tech_stacks.map((tech) => (
                tech.technology_stacks && (
                  <Badge 
                    key={tech.id} 
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    {tech.technology_stacks.icon_url && (
                      <img 
                        src={tech.technology_stacks.icon_url} 
                        alt={tech.technology_stacks.name}
                        className="w-4 h-4"
                      />
                    )}
                    {tech.technology_stacks.name}
                  </Badge>
                )
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}