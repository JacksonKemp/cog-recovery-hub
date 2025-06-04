import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { format } from "date-fns";

export type SymptomRatings = {
  headache: number;
  fatigue: number;
  anxiety: number;
  focus: number;
};

export type SymptomEntry = {
  id: string;
  date: string;
  symptoms: SymptomRatings;
  notes: string;
};

// Temporary user ID for demo purposes - would come from authentication in a real app
const TEMP_USER_ID = "demo-user-1";

export async function saveSymptomEntry(symptoms: SymptomRatings, notes: string): Promise<string> {
  const { data, error } = await supabase
    .from('symptom_entries')
    .insert({
      user_id: TEMP_USER_ID,
      symptoms,
      notes
    })
    .select();

  if (error) {
    console.error("Error saving symptom entry:", error);
    throw new Error("Failed to save symptom entry");
  }

  return data?.[0]?.id || "";
}

export async function hasEntryForToday(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("[DEBUG] hasEntry user:", user);

  if (!user) throw new Error("User not authenticated");

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
  
  const { data, error } = await supabase
    .from('symptom_entries')
    .select('id')
    .eq('user_id', user.id)
    .gte('created_at', startOfDay)
    .lte('created_at', endOfDay)
    .limit(1);
    
  console.log("[DEBUG] hasEntry query:", { data, error });
  if (error) throw error;
  
  return (data?.length ?? 0) > 0;
}

export async function getRecentEntries(limit = 3): Promise<SymptomEntry[]> {
  const { data: { user } } = await supabase.auth.getUser();
  console.log("[DEBUG] getRecent user:", user);

  if (!user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('symptom_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  console.log("[DEBUG] getRecent query:", { data, error });
  if (error) throw error;
  
  return data?.map(entry => ({
    id: entry.id,
    date: formatEntryDate(entry.created_at),
    symptoms: entry.symptoms as SymptomRatings,
    notes: entry.notes || ""
  })) || [];
}

function formatEntryDate(dateString: string): string {
  const entryDate = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (entryDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return "Today";
  } else if (entryDate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0)) {
    return "Yesterday";
  } else {
    return format(entryDate, "MMM d, yyyy");
  }
}
