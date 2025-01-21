import { supabase } from "@/integrations/supabase/client";
import Papa from 'papaparse';

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

  // Convert to CSV
  const csv = Papa.unparse(exportData, {
    quotes: true, // Wrap fields in quotes
    header: true, // Include header row
  });

  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  const filename = `participants_export_${date}.csv`;
  
  // Handle download for all browsers
  if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
    (window.navigator as any).msSaveOrOpenBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}