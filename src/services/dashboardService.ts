
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays, isAfter } from "date-fns";

export interface DashboardStats {
  streakDays: number;
  completedGames: number;
}

/**
 * Calculates the current streak of days with activity
 */
export async function calculateStreak(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // Get all game progress entries for the user, ordered by date
    const { data: gameEntries } = await supabase
      .from('game_progress')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Get all symptom entries for the user, ordered by date
    const { data: symptomEntries } = await supabase
      .from('symptom_entries')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Combine all activity dates
    const allDates = [
      ...(gameEntries || []).map(entry => entry.created_at),
      ...(symptomEntries || []).map(entry => entry.created_at)
    ];

    if (allDates.length === 0) return 0;

    // Convert to unique days (remove duplicates for same day)
    const uniqueDays = new Set(
      allDates.map(date => startOfDay(new Date(date)).toISOString())
    );

    const sortedDays = Array.from(uniqueDays)
      .map(day => new Date(day))
      .sort((a, b) => b.getTime() - a.getTime()); // Most recent first

    let streak = 0;
    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));

    // Check if there's activity today or yesterday (to allow for different timezones)
    const hasRecentActivity = sortedDays.some(day => 
      day.getTime() === today.getTime() || day.getTime() === yesterday.getTime()
    );

    if (!hasRecentActivity) return 0;

    // Calculate consecutive days
    for (let i = 0; i < sortedDays.length; i++) {
      const currentDay = sortedDays[i];
      const expectedDay = startOfDay(subDays(today, streak));
      
      if (currentDay.getTime() === expectedDay.getTime()) {
        streak++;
      } else if (streak === 0 && currentDay.getTime() === yesterday.getTime()) {
        // Allow streak to start from yesterday
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}

/**
 * Gets the total number of completed games
 */
export async function getCompletedGamesCount(): Promise<number> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const { count } = await supabase
      .from('game_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    return count || 0;
  } catch (error) {
    console.error('Error getting completed games count:', error);
    return 0;
  }
}

/**
 * Fetches all dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [streakDays, completedGames] = await Promise.all([
    calculateStreak(),
    getCompletedGamesCount()
  ]);

  return {
    streakDays,
    completedGames
  };
}
