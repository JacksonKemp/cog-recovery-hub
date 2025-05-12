
import { supabase } from "@/integrations/supabase/client";

export interface PatientData {
  id: string;
  email: string;
  fullName?: string;
}

export const verifyPractitionerAccess = async (accessCode: string): Promise<PatientData | null> => {
  try {
    localStorage.setItem('practitioner_access_code', accessCode);

    const { data: accessData, error: accessError } = await supabase
      .from('user_practitioners')
      .select('user_id, is_active, access_expires_at')
      .eq('access_code', accessCode)
      .eq('is_active', true)
      .maybeSingle();

    if (accessError || !accessData) {
      console.error("Access verification failed:", accessError);
      localStorage.removeItem('practitioner_access_code');
      return null;
    }

    if (accessData.access_expires_at && new Date(accessData.access_expires_at) < new Date()) {
      console.error("Access code has expired");
      localStorage.removeItem('practitioner_access_code');
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', accessData.user_id)
      .maybeSingle();

    if (userError) {
      console.error("Error fetching user data:", userError);
      localStorage.removeItem('practitioner_access_code');
      return null;
    }

    const { data: { user: authUser } } = await supabase.auth.getUser();
    let email = "Patient";

    if (authUser && authUser.id === accessData.user_id) {
      email = authUser.email || "Patient";
    }

    return {
      id: accessData.user_id,
      email: email,
      fullName: userData?.full_name
    };
  } catch (error) {
    console.error("Error in verifyPractitionerAccess:", error);
    localStorage.removeItem('practitioner_access_code');
    return null;
  }
};

export const getPractitionerAccessCode = (): string | null => {
  return localStorage.getItem('practitioner_access_code');
};

export const clearPractitionerAccess = (): void => {
  localStorage.removeItem('practitioner_access_code');
};

export const usePractitionerHeaders = () => {
  const accessCode = getPractitionerAccessCode();
  return accessCode ? { 'x-practitioner-access-code': accessCode } : {};
};
