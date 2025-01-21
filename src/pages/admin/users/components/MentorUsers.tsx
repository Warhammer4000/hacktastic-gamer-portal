import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMentorActions } from "./mentor/useMentorActions";
import { MentorContent } from "./mentor/MentorContent";
import { useDebounce } from "../hooks/useDebounce";

export default function MentorUsers() {
  const navigate = useNavigate();
  const { handleDelete } = useMentorActions();
  
  const handleEdit = (mentorId: string) => {
    navigate(`/admin/mentors/edit/${mentorId}`);
  };

  return (
    <div className="space-y-4">
      <MentorContent />
    </div>
  );
}