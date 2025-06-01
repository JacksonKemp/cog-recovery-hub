import { supabase } from "@/integrations/supabase/client";

export interface Practitioner {
  id: string;
  name: string;
  email: string;
  specialty: string | null;
  created_at: string;
}

export interface PractitionerAccess {
  id: string;
  user_id: string;
  practitioner_id: string;
  practitioner: Practitioner | null; // Make practitioner nullable to handle potential null values
  access_code: string;
  access_granted_at: string;
  access_expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export const getUserPractitioners = async (): Promise<PractitionerAccess[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('user_practitioners')
    .select(`
      *,
      practitioner:practitioners(*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching practitioners:", error);
    throw new Error("Failed to fetch practitioners");
  }
  
  return data as PractitionerAccess[] || [];
};

export const addPractitioner = async (name: string, email: string, specialty?: string): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("[DEBUG] No authenticated user found when adding practitioner");
    throw new Error("User not authenticated");
  }
  console.log("[DEBUG] Adding practitioner with:", { userId: user.id, name, email, specialty });
  const { data, error } = await supabase.rpc('add_practitioner_for_user', {
    _user_id: user.id,
    _practitioner_name: name,
    _practitioner_email: email,
    _practitioner_specialty: specialty || null,
    _expires_in_days: null // No expiration by default
  });
  console.log("[DEBUG] addPractitioner result:", { data, error });
  if (error) {
    console.error("[DEBUG] Error adding practitioner:", error);
    throw new Error("Failed to add practitioner");
  }
  return data || "";
};

export const revokePractitionerAccess = async (practitionerAccessId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('user_practitioners')
    .update({ is_active: false })
    .eq('id', practitionerAccessId)
    .eq('user_id', user.id);

  if (error) {
    console.error("Error revoking practitioner access:", error);
    throw new Error("Failed to revoke practitioner access");
  }
};

export const regenerateAccessCode = async (practitionerAccessId: string): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Generate a new code
  const { data: newCode, error: genError } = await supabase.rpc('generate_access_code');
  
  if (genError) {
    console.error("Error generating new code:", genError);
    throw new Error("Failed to generate new access code");
  }

  // Update the access code
  const { error: updateError } = await supabase
    .from('user_practitioners')
    .update({ access_code: newCode })
    .eq('id', practitionerAccessId)
    .eq('user_id', user.id);

  if (updateError) {
    console.error("Error updating access code:", updateError);
    throw new Error("Failed to update access code");
  }

  return newCode;
};
