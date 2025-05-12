
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GameProgressEntry } from "./types";

/**
 * Fetches game progress data from Supabase
 * @param category Optional category filter
 * @returns Array of game progress entries
 */
export const getGameProgress = async (category?: string): Promise<GameProgressEntry[]> => {
  try {
    console.log("Getting game progress for category:", category);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      toast.error("Please log in to view your game progress");
      throw new Error("User not authenticated");
    }
    
    console.log("Authenticated user:", user.id);
    
    let query = supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (category) {
      query = query.eq('category', category);
    }
    
    console.log("Executing query for game progress");
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching game progress:", error);
      toast.error("Failed to fetch game progress");
      throw new Error("Failed to fetch game progress");
    }
    
    console.log("Game progress data retrieved:", data?.length || 0, "entries");
    if (data?.length) {
      console.log("Sample entry:", data[0]);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getGameProgress:", error);
    return [];
  }
};

/**
 * Saves game progress to Supabase
 */
export const saveGameProgress = async (
  gameType: string,
  category: string,
  score: number,
  maxScore?: number,
  level?: number,
  timeTaken?: number
): Promise<string> => {
  try {
    console.log("Starting saveGameProgress with:", { gameType, category, score, maxScore, level, timeTaken });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      toast.error("Please log in to save your game progress");
      throw new Error("User not authenticated");
    }
    
    console.log("Authenticated user for save:", user.id);
    
    const gameData = {
      user_id: user.id,
      game_type: gameType,
      category: category,
      score: score,
      max_score: maxScore || null,
      level: level || null,
      time_taken: timeTaken || null
    };
    
    console.log("Saving game progress:", gameData);
    
    const { data, error } = await supabase
      .from('game_progress')
      .insert(gameData)
      .select();
      
    if (error) {
      console.error("Error saving game progress:", error);
      toast.error("Failed to save game progress");
      throw new Error(`Failed to save game progress: ${error.message}`);
    }
    
    console.log("Game progress saved successfully:", data);
    toast.success("Game progress saved successfully!");
    return data?.[0]?.id || "";
  } catch (error) {
    console.error("Error in saveGameProgress:", error);
    throw error;
  }
};
