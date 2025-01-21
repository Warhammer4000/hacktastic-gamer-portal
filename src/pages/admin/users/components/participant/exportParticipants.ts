import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';

export async function exportParticipants() {
  const { data: participants } = await supabase
    .from("profiles")
    .select(`
      *,
      user_roles!inner (
        role
      ),
      institutions (
        name
      )
    `)
    .eq("user_roles.role", "participant");

  if (!participants) return;

  const exportData = participants.map(participant => ({
    email: participant.email || '',
    full_name: participant.full_name || '',
    github_username: participant.github_username || '',
    institution_name: participant.institutions?.name || '',
    bio: participant.bio || '',
    avatar_url: participant.avatar_url || '',
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  const colWidths = [
    { wch: 30 }, // email
    { wch: 20 }, // full_name
    { wch: 20 }, // github_username
    { wch: 25 }, // institution_name
    { wch: 40 }, // bio
    { wch: 40 }, // avatar_url
  ];

  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Participants");
  
  // Generate filename with current date
  const date = new Date().toISOString().split('T')[0];
  const filename = `participants_export_${date}.xlsx`;
  
  XLSX.writeFile(wb, filename);
}