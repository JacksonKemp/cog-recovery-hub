
import { supabase } from "@/integrations/supabase/client";

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
  const { user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
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
    throw new Error("Failed to fetch game progress");
  }
  
  return data || [];
};

export const saveGameProgress = async (
  gameType: string,
  category: string,
  score: number,
  maxScore?: number,
  level?: number,
  timeTaken?: number
): Promise<string> => {
  const { user } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  const { data, error } = await supabase
    .from('game_progress')
    .insert({
      user_id: user.id,
      game_type: gameType,
      category: category,
      score: score,
      max_score: maxScore || null,
      level: level || null,
      time_taken: timeTaken || null
    })
    .select();
    
  if (error) {
    console.error("Error saving game progress:", error);
    throw new Error("Failed to save game progress");
  }
  
  return data?.[0]?.id || "";
};

export const getMostImprovedGame = async (category: string): Promise<{ game: string; improvement: number } | null> => {
  const { user } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('game_progress')
    .select('*')
    .eq('category', category)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
    
  if (error || !data || data.length < 2) {
    return null;
  }
  
  // Group by game type
  const gameTypeGroups = data.reduce((acc: Record<string, GameProgressEntry[]>, entry) => {
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
};
