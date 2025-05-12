
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
    
    // The toJSON() method doesn't exist on PostgrestFilterBuilder, removing this line
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

export const getMostImprovedGame = async (category: string): Promise<{ game: string; improvement: number } | null> => {
  try {
    console.log("Getting most improved game for category:", category);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("No authenticated user for most improved calculation");
      return null;
    }
    
    console.log("Authenticated user for most improved:", user.id);
    
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
    
    console.log(`Found ${progressEntries.length} entries for most improved calculation`);
    
    if (progressEntries.length < 2) {
      console.log("Not enough entries to calculate improvement");
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
        console.log(`Improvement for ${gameType}: ${improvement} points`);
        
        if (improvement > mostImproved.improvement) {
          mostImproved = {
            game: gameType,
            improvement: improvement
          };
        }
      }
    });
    
    console.log("Most improved game calculation result:", mostImproved);
    return mostImproved.game ? mostImproved : null;
  } catch (error) {
    console.error("Error in getMostImprovedGame:", error);
    return null;
  }
};

// Add a test function to manually verify data saving
export const testSaveGameProgress = async (): Promise<boolean> => {
  try {
    const result = await saveGameProgress(
      'test-game', 
      'memory', 
      100,
      100,
      1,
      60
    );
    console.log("Test save result:", result);
    toast.success("Test save completed successfully");
    return !!result;
  } catch (error) {
    console.error("Test save failed:", error);
    toast.error("Test save failed");
    return false;
  }
};
