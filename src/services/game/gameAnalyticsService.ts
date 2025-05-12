
import { supabase } from "@/integrations/supabase/client";
import { GameProgressEntry } from "./types";

/**
 * Gets the most improved game for a specific category
 * @param category Game category
 * @returns Object with game name and improvement score, or null if not available
 */
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
