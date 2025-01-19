import { supabase } from "@/integrations/supabase/client";

export async function deleteUser(userId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('admin-operations', {
      body: {
        operation: 'deleteUser',
        data: { userId }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Add other admin operations as needed