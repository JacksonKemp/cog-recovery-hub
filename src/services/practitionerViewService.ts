
import { supabase } from "@/integrations/supabase/client";
import { GameProgressEntry } from "@/services/gameService";
import { usePractitionerHeaders } from "@/services/practitionerAuthService";

export const getPractitionerViewGameProgress = async (patientId: string): Promise<GameProgressEntry[]> => {
  const headers = usePractitionerHeaders();
  if (!headers['x-practitioner-access-code']) {
    throw new Error("Practitioner access code not provided");
  }

  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', patientId)
    .order('created_at', { ascending: false })
    .options({ headers });

  if (error) {
    console.error("Error fetching game progress:", error);
    throw new Error("Failed to fetch game progress");
  }

  return data || [];
};

export type SymptomEntry = {
  id: string;
  symptoms: Record<string, number>;
  notes: string | null;
  created_at: string;
  user_id: string;
};

export const getPractitionerViewSymptoms = async (patientId: string): Promise<SymptomEntry[]> => {
  const headers = usePractitionerHeaders();
  if (!headers['x-practitioner-access-code']) {
    throw new Error("Practitioner access code not provided");
  }

  const { data, error } = await supabase
    .from('symptom_entries')
    .select('*')
    .eq('user_id', patientId)
    .order('created_at', { ascending: false })
    .options({ headers });

  if (error) {
    console.error("Error fetching symptoms:", error);
    throw new Error("Failed to fetch symptoms");
  }

  return data || [];
};
