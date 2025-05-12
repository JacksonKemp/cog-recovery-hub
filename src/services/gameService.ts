
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type GameProgressEntry = {
  id: string;
  game_type: string;
  category: string;
  score: number;
  max_score: number | null;
  level: number | null;
  time_taken: number | null;
  created_at: string;
};

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
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching game progress:", error);
      toast.error("Failed to fetch game progress");
      throw new Error("Failed to fetch game progress");
    }
    
    console.log("Game progress data retrieved:", data?.length || 0, "entries");
    return data || [];
  } catch (error) {
    console.error("Error in getGameProgress:", error);
    return [];
  }
};

export const saveGameProgress = async (
  gameType: string,
  category: string,
  score: number,
  maxScore?: number,
  level?: number,
  timeTaken?: number
): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      toast.error("Please log in to save your game progress");
      throw new Error("User not authenticated");
    }
    
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
      throw new Error("Failed to save game progress");
    }
    
    console.log("Game progress saved successfully:", data);
    return data?.[0]?.id || "";
  } catch (error) {
    console.error("Error in saveGameProgress:", error);
    throw error;
  }
};

export const getMostImprovedGame = async (category: string): Promise<{ game: string; improvement: number } | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('game_progress')
      .select('*')
      .eq('category', category)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error || !data) {
      console.error("Error getting most improved game:", error);
      return null;
    }
    
    // Ensure data is treated as an array of GameProgressEntry
    const progressEntries = data as GameProgressEntry[];
    
    if (progressEntries.length < 2) {
      return null;
    }
    
    // Group by game type
    const gameTypeGroups = progressEntries.reduce((acc: Record<string, GameProgressEntry[]>, entry) => {
      if (!acc[entry.game_type]) {
        acc[entry.game_type] = [];
      }
      acc[entry.game_type].push(entry);
      return acc;
    }, {});
    
    let mostImproved = { game: '', improvement: 0 };
    
    // Find most improved
    Object.entries(gameTypeGroups).forEach(([gameType, entries]) => {
      if (entries.length >= 2) {
        // Sort by date, oldest first
        entries.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        
        const oldest = entries[0];
        const newest = entries[entries.length - 1];
        
        // Calculate improvement
        const improvement = newest.score - oldest.score;
        
        if (improvement > mostImproved.improvement) {
          mostImproved = {
            game: gameType,
            improvement: improvement
          };
        }
      }
    });
    
    return mostImproved.game ? mostImproved : null;
  } catch (error) {
    console.error("Error in getMostImprovedGame:", error);
    return null;
  }
};
