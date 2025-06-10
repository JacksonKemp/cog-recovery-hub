
import { supabase } from "@/integrations/supabase/client";
import { SymptomRatings } from "./symptomService";
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from "date-fns";

export type ChartDataPoint = {
  date: string;
  headache: number;
  fatigue: number;
  anxiety: number;
  focus: number;
};

export async function getSymptomChartData(timeFrame: "week" | "month" | "year" | "all"): Promise<ChartDataPoint[]> {
  console.log("[DEBUG] getSymptomChartData called with timeFrame:", timeFrame);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("User not authenticated in getSymptomChartData:", userError);
    return [];
  }

  let startDate: Date;
  const endDate = new Date();

  // Calculate start date based on timeframe
  switch (timeFrame) {
    case "week":
      startDate = subDays(endDate, 6); // Last 7 days including today
      break;
    case "month":
      startDate = subWeeks(endDate, 3); // Last 4 weeks
      break;
    case "year":
      startDate = subMonths(endDate, 11); // Last 12 months
      break;
    case "all":
      startDate = new Date(2020, 0, 1); // Far back date to get all data
      break;
    default:
      startDate = subDays(endDate, 6);
  }

  console.log("[DEBUG] Fetching data from:", startDate.toISOString(), "to:", endDate.toISOString());

  const { data, error } = await supabase
    .from('symptom_entries')
    .select('created_at, symptoms')
    .eq('user_id', user.id)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Error fetching symptom chart data:", error);
    return [];
  }

  console.log("[DEBUG] Raw symptom data:", data);

  // Process data based on timeframe
  if (timeFrame === "week") {
    return processWeeklyData(data || [], startDate, endDate);
  } else if (timeFrame === "month") {
    return processMonthlyData(data || [], startDate, endDate);
  } else if (timeFrame === "year" || timeFrame === "all") {
    return processYearlyData(data || [], startDate, endDate);
  }

  return [];
}

function processWeeklyData(data: any[], startDate: Date, endDate: Date): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  
  // Create entries for each day in the last 7 days
  for (let i = 0; i < 7; i++) {
    const currentDate = subDays(endDate, 6 - i);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    
    // Find entries for this day
    const dayEntries = data.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= dayStart && entryDate <= dayEnd;
    });
    
    // Calculate average for the day (or 0 if no entries)
    const avgSymptoms = calculateAverageSymptoms(dayEntries);
    
    result.push({
      date: format(currentDate, 'EEE'), // Mon, Tue, etc.
      ...avgSymptoms
    });
  }
  
  return result;
}

function processMonthlyData(data: any[], startDate: Date, endDate: Date): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  
  // Create entries for each week in the last 4 weeks
  for (let i = 0; i < 4; i++) {
    const weekStart = subWeeks(endDate, 3 - i);
    const weekEnd = subWeeks(endDate, 2 - i);
    
    // Find entries for this week
    const weekEntries = data.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    // Calculate average for the week
    const avgSymptoms = calculateAverageSymptoms(weekEntries);
    
    result.push({
      date: `Week ${i + 1}`,
      ...avgSymptoms
    });
  }
  
  return result;
}

function processYearlyData(data: any[], startDate: Date, endDate: Date): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  
  // Create entries for each month in the last 12 months
  for (let i = 0; i < 12; i++) {
    const monthStart = subMonths(endDate, 11 - i);
    const monthEnd = subMonths(endDate, 10 - i);
    
    // Find entries for this month
    const monthEntries = data.filter(entry => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
    
    // Calculate average for the month
    const avgSymptoms = calculateAverageSymptoms(monthEntries);
    
    result.push({
      date: format(monthStart, 'MMM'), // Jan, Feb, etc.
      ...avgSymptoms
    });
  }
  
  return result;
}

function calculateAverageSymptoms(entries: any[]): SymptomRatings {
  if (entries.length === 0) {
    return { headache: 0, fatigue: 0, anxiety: 0, focus: 0 };
  }
  
  const totals = entries.reduce((acc, entry) => {
    const symptoms = entry.symptoms as SymptomRatings;
    return {
      headache: acc.headache + symptoms.headache,
      fatigue: acc.fatigue + symptoms.fatigue,
      anxiety: acc.anxiety + symptoms.anxiety,
      focus: acc.focus + symptoms.focus
    };
  }, { headache: 0, fatigue: 0, anxiety: 0, focus: 0 });
  
  return {
    headache: Math.round(totals.headache / entries.length),
    fatigue: Math.round(totals.fatigue / entries.length),
    anxiety: Math.round(totals.anxiety / entries.length),
    focus: Math.round(totals.focus / entries.length)
  };
}
