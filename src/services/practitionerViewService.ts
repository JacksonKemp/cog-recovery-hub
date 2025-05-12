
import { supabase } from "@/integrations/supabase/client";
import { GameProgressEntry } from "@/services/gameService";
import { getPractitionerAccessCode } from "@/services/practitionerAuthService";

export const getPractitionerViewGameProgress = async (patientId: string): Promise<GameProgressEntry[]> => {
  const accessCode = getPractitionerAccessCode();
  if (!accessCode) {
    throw new Error("Practitioner access code not provided");
  }

  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('user_id', patientId)
    .order('created_at', { ascending: false });

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
  const accessCode = getPractitionerAccessCode();
  if (!accessCode) {
    throw new Error("Practitioner access code not provided");
  }

  const { data, error } = await supabase
    .from('symptom_entries')
    .select('*')
    .eq('user_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching symptoms:", error);
    throw new Error("Failed to fetch symptoms");
  }

  // Properly convert the JSON symptoms to the expected Record<string, number> type
  return (data || []).map(entry => ({
    ...entry,
    symptoms: typeof entry.symptoms === 'string' 
      ? JSON.parse(entry.symptoms) 
      : entry.symptoms as Record<string, number>,
  }));
};
