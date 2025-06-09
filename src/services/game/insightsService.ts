
import { supabase } from "@/integrations/supabase/client";

export interface InsightsData {
  insights: string;
}

/**
 * Generates AI-powered insights based on 6-month rolling game performance
 */
export const generateInsights = async (): Promise<string> => {
  try {
    console.log("Generating AI insights for game performance");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated for insights");
      return "Please log in to view personalized insights about your cognitive performance.";
    }

    const { data, error } = await supabase.functions.invoke('generate-insights', {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) {
      console.error("Error generating insights:", error);
      return "Unable to generate insights at the moment. Your performance data shows consistent engagement with cognitive exercises!";
    }

    return data.insights || "Keep up the great work with your cognitive training!";
  } catch (error) {
    console.error("Error in generateInsights:", error);
    return "Your cognitive training journey is progressing well. Continue playing games to unlock more detailed insights!";
  }
};
