import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SessionCard } from "./SessionCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SessionListViewProps {
  onEditSession: (session: any) => void;
}

export function SessionListView({ onEditSession }: SessionListViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [techStackFilter, setTechStackFilter] = useState<string>("all");

  const { data: techStacks = [] } = useQuery({
    queryKey: ["techStacks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("technology_stacks")
        .select("*")
        .eq("status", "active");

      if (error) throw error;
      return data;
    },
  });

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['session-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_templates')
        .select(`
          *,
          technology_stacks (
            id,
            name,
            icon_url
          ),
          session_availabilities (
            id,
            day_of_week,
            start_time,
            end_time
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredSessions = sessions?.filter(session => {
    const matchesSearch = session.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : session.status === statusFilter;
    const matchesTechStack = techStackFilter === "all" 
      ? true 
      : techStackFilter === "none" 
        ? !session.tech_stack_id
        : session.tech_stack_id === techStackFilter;
    return matchesSearch && matchesStatus && matchesTechStack;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Search sessions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={techStackFilter} onValueChange={setTechStackFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by tech stack" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tech Stacks</SelectItem>
            <SelectItem value="none">No Tech Stack</SelectItem>
            {techStacks.map((stack) => (
              <SelectItem key={stack.id} value={stack.id}>
                {stack.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="h-[calc(100vh-6rem)] rounded-md border p-4">
        <div className="space-y-4">
          {filteredSessions?.map((session) => (
            <SessionCard 
              key={session.id} 
              session={session}
              onEdit={onEditSession}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}