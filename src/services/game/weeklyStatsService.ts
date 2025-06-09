
import { supabase } from "@/integrations/supabase/client";
import { GameProgressEntry } from "./types";

export interface WeeklyStats {
  category: string;
  weekStart: string;
  averagePercentage: number;
  averageDifficulty: string;
  gamesPlayed: number;
}

/**
 * Gets weekly statistics for game progress by category
 */
export const getWeeklyStats = async (category?: string): Promise<WeeklyStats[]> => {
  try {
    console.log("Getting weekly stats for category:", category);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return [];
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
    
    if (error || !data) {
      console.error("Error fetching game progress for weekly stats:", error);
      return [];
    }
    
    return calculateWeeklyStats(data);
  } catch (error) {
    console.error("Error in getWeeklyStats:", error);
    return [];
  }
};

/**
 * Calculates weekly statistics from game progress data
 */
function calculateWeeklyStats(data: GameProgressEntry[]): WeeklyStats[] {
  if (!data || data.length === 0) return [];
  
  // Group data by category and week
  const weeklyGroups: Record<string, Record<string, GameProgressEntry[]>> = {};
  
  data.forEach(entry => {
    const date = new Date(entry.created_at);
    const weekStart = getWeekStart(date);
    const key = `${entry.category}-${weekStart}`;
    
    if (!weeklyGroups[entry.category]) {
      weeklyGroups[entry.category] = {};
    }
    
    if (!weeklyGroups[entry.category][weekStart]) {
      weeklyGroups[entry.category][weekStart] = [];
    }
    
    weeklyGroups[entry.category][weekStart].push(entry);
  });
  
  // Calculate stats for each category/week combination
  const weeklyStats: WeeklyStats[] = [];
  
  Object.entries(weeklyGroups).forEach(([category, weeks]) => {
    Object.entries(weeks).forEach(([weekStart, entries]) => {
      const stats = calculateStatsForWeek(entries);
      
      weeklyStats.push({
        category,
        weekStart,
        averagePercentage: stats.averagePercentage,
        averageDifficulty: stats.averageDifficulty,
        gamesPlayed: entries.length
      });
    });
  });
  
  // Sort by week start date, most recent first
  return weeklyStats.sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
}

/**
 * Gets the start of the week (Monday) for a given date
 */
function getWeekStart(date: Date): string {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(date.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString().split('T')[0];
}

/**
 * Calculates average percentage and difficulty for a week's worth of games
 */
function calculateStatsForWeek(entries: GameProgressEntry[]) {
  let totalPercentage = 0;
  let totalDifficulty = 0;
  let validEntries = 0;
  
  entries.forEach(entry => {
    if (entry.max_score && entry.max_score > 0) {
      const percentage = (entry.score / entry.max_score) * 100;
      totalPercentage += percentage;
      validEntries++;
    }
    
    if (entry.level) {
      totalDifficulty += entry.level;
    }
  });
  
  const averagePercentage = validEntries > 0 ? Math.round(totalPercentage / validEntries) : 0;
  const averageDifficultyLevel = totalDifficulty > 0 ? totalDifficulty / entries.length : 2;
  
  let averageDifficulty = "medium";
  if (averageDifficultyLevel <= 1.3) {
    averageDifficulty = "easy";
  } else if (averageDifficultyLevel >= 2.7) {
    averageDifficulty = "hard";
  }
  
  return {
    averagePercentage,
    averageDifficulty
  };
}
