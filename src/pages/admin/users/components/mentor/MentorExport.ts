import { MentorData } from "../../types/mentor";
import * as XLSX from 'xlsx';

export function exportMentors(mentors: MentorData[]) {
  const exportData = mentors.map(mentor => ({
    email: mentor.email,
    full_name: mentor.full_name || '',
    github_username: mentor.github_username || '',
    linkedin_profile_id: mentor.linkedin_profile_id || '',
    institution: mentor.institutions?.name || '',
    team_count: mentor.mentor_preferences?.[0]?.team_count || 1,
    tech_stacks: mentor.mentor_tech_stacks
      ?.map(stack => stack.technology_stacks?.name)
      .filter(Boolean)
      .join(', ') || '',
    status: mentor.status,
    bio: mentor.bio || ''
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Mentors");
  XLSX.writeFile(wb, "mentors.xlsx");
}