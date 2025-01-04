import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Github, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Mentor {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  linkedin_profile_id: string | null;
  github_username: string | null;
  mentor_tech_stacks: {
    technology_stacks: {
      id: string;
      name: string;
    };
  }[];
}

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [selectedTechStack, setSelectedTechStack] = useState<string | null>(null);

  const { data: techStacks } = useQuery({
    queryKey: ['technology-stacks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technology_stacks')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: mentors, isLoading } = useQuery({
    queryKey: ['public-mentors', selectedTechStack],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          avatar_url,
          bio,
          linkedin_profile_id,
          github_username,
          mentor_tech_stacks (
            technology_stacks (
              id,
              name
            )
          )
        `)
        .eq('status', 'approved')
        .eq('is_profile_approved', true);

      if (selectedTechStack) {
        query = query.eq('mentor_tech_stacks.tech_stack_id', selectedTechStack);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Mentor[];
    },
  });

  const filteredMentors = mentors?.filter(mentor => 
    mentor.full_name.toLowerCase().includes(search.toLowerCase()) ||
    mentor.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Our Mentors</h1>
        <p className="text-muted-foreground">
          Connect with our experienced mentors who are ready to guide you
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search mentors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedTechStack === null ? "default" : "outline"}
            onClick={() => setSelectedTechStack(null)}
          >
            All
          </Button>
          {techStacks?.map((tech) => (
            <Button
              key={tech.id}
              variant={selectedTechStack === tech.id ? "default" : "outline"}
              onClick={() => setSelectedTechStack(tech.id)}
            >
              {tech.name}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading mentors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors?.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.full_name} />
                    <AvatarFallback>{mentor.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{mentor.full_name}</h3>
                    <div className="flex gap-2 mt-2">
                      {mentor.github_username && (
                        <a
                          href={`https://github.com/${mentor.github_username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {mentor.linkedin_profile_id && (
                        <a
                          href={`https://linkedin.com/in/${mentor.linkedin_profile_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {mentor.bio && <p className="text-sm text-muted-foreground">{mentor.bio}</p>}
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                {mentor.mentor_tech_stacks.map((tech, index) => (
                  <Badge key={index} variant="secondary">
                    {tech.technology_stacks.name}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}