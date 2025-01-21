import { MentorData } from "../../types/mentor";
import Papa from 'papaparse';

export function exportMentors(mentors: MentorData[]) {
  const exportData = mentors.map(mentor => ({
    email: mentor.email,
    full_name: mentor.full_name || '',
    github_username: mentor.github_username || '',
    linkedin_profile_id: mentor.linkedin_profile_id || '',
    institution: mentor.institutions?.name || '',
    bio: mentor.bio || '',
    avatar_url: mentor.avatar_url || '',
    team_count: mentor.mentor_preferences?.[0]?.team_count || 1,
    tech_stacks: mentor.mentor_tech_stacks
      ?.map(stack => stack.technology_stacks?.name)
      .filter(Boolean)
      .join(';') || '',
  }));

  // Convert to CSV
  const csv = Papa.unparse(exportData, {
    quotes: true, // Wrap fields in quotes
    header: true, // Include header row
  });

  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, `mentors_export_${date}.csv`);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `mentors_export_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}