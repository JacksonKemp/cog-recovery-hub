
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

export async function saveSymptomEntry(symptoms: SymptomRatings, notes: string): Promise<string> {
  console.log("[DEBUG] saveSymptomEntry called with:", { symptoms, notes });
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log("[DEBUG] saveSymptomEntry user check:", user ? "User found" : "No user", userError);
  
  if (userError || !user) {
    console.error("User not authenticated:", userError);
    throw new Error("User not authenticated");
  }

  console.log("[DEBUG] Attempting to insert symptom entry for user:", user.id);
  
  const { data, error } = await supabase
    .from('symptom_entries')
    .insert({
      user_id: user.id,
      symptoms,
      notes
    })
    .select();

  console.log("[DEBUG] Insert result:", { data, error });

  if (error) {
    console.error("Error saving symptom entry:", error);
    throw new Error("Failed to save symptom entry");
  }

  return data?.[0]?.id || "";
}

export async function hasEntryForToday(): Promise<boolean> {
  try {
    console.log("[DEBUG] hasEntryForToday called");
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("[DEBUG] hasEntry user check:", user ? "User found" : "No user", userError);

    if (userError || !user) {
      console.error("User not authenticated in hasEntryForToday:", userError);
      return false;
    }

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999)).toISOString();
    
    console.log("[DEBUG] Checking entries between:", { startOfDay, endOfDay, userId: user.id });
    
    const { data, error } = await supabase
      .from('symptom_entries')
      .select('id')
      .eq('user_id', user.id)
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
      .limit(1);
      
    console.log("[DEBUG] hasEntry query result:", { data, error, userId: user.id });
    
    if (error) {
      console.error("Error checking today's entries:", error);
      return false;
    }
    
    const hasEntry = (data?.length ?? 0) > 0;
    console.log("[DEBUG] hasEntry final result:", hasEntry);
    return hasEntry;
  } catch (error) {
    console.error("Exception in hasEntryForToday:", error);
    return false;
  }
}

export async function getRecentEntries(limit = 3): Promise<SymptomEntry[]> {
  try {
    console.log("[DEBUG] getRecentEntries called with limit:", limit);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("[DEBUG] getRecent user check:", user ? "User found" : "No user", userError);

    if (userError || !user) {
      console.error("User not authenticated in getRecentEntries:", userError);
      return [];
    }

    console.log("[DEBUG] Fetching recent entries for user:", user.id);

    const { data, error } = await supabase
      .from('symptom_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    console.log("[DEBUG] getRecent query result:", { data, error, userId: user.id });
    
    if (error) {
      console.error("Error fetching recent entries:", error);
      return [];
    }
    
    const entries = data?.map(entry => ({
      id: entry.id,
      date: formatEntryDate(entry.created_at),
      symptoms: entry.symptoms as SymptomRatings,
      notes: entry.notes || ""
    })) || [];
    
    console.log("[DEBUG] getRecent formatted entries:", entries);
    return entries;
  } catch (error) {
    console.error("Exception in getRecentEntries:", error);
    return [];
  }
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
