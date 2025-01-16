import { MentorData } from "../../types/mentor";
import * as XLSX from 'xlsx';

export function exportMentors(mentors: MentorData[]) {
  const exportData = mentors.map(mentor => ({
    email: mentor.email,
    full_name: mentor.full_name || '',
    github_username: mentor.github_username || '',
    linkedin_profile_id: mentor.linkedin_profile_id || '',
    institution: mentor.institutions?.name || '',
    bio: mentor.bio || '',
    avatar_url: mentor.avatar_url || '',
    status: mentor.status,
    is_profile_approved: mentor.is_profile_approved ? 'Yes' : 'No',
    is_profile_completed: mentor.is_profile_completed ? 'Yes' : 'No',
    team_count: mentor.mentor_preferences?.[0]?.team_count || 1,
    tech_stacks: mentor.mentor_tech_stacks
      ?.map(stack => stack.technology_stacks?.name)
      .filter(Boolean)
      .join(', ') || '',
    created_at: new Date(mentor.created_at).toLocaleDateString(),
    updated_at: new Date(mentor.updated_at).toLocaleDateString(),
  }));

  // Create worksheet with custom column widths
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  const colWidths = [
    { wch: 30 }, // email
    { wch: 20 }, // full_name
    { wch: 20 }, // github_username
    { wch: 20 }, // linkedin_profile_id
    { wch: 25 }, // institution
    { wch: 40 }, // bio
    { wch: 40 }, // avatar_url
    { wch: 15 }, // status
    { wch: 15 }, // is_profile_approved
    { wch: 15 }, // is_profile_completed
    { wch: 10 }, // team_count
    { wch: 30 }, // tech_stacks
    { wch: 12 }, // created_at
    { wch: 12 }, // updated_at
  ];

  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Mentors");
  
  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const filename = `mentors_export_${date}.xlsx`;
  
  XLSX.writeFile(wb, filename);
}