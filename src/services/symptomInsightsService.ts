
import { supabase } from "@/integrations/supabase/client";

export interface SymptomInsightsData {
  insights: string;
}

/**
 * Generates AI-powered insights based on symptom tracking data
 */
export const generateSymptomInsights = async (): Promise<string> => {
  try {
    console.log("Generating AI insights for symptom data");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated for insights");
      return "Please log in to view personalized insights about your symptom recovery.";
    }

    const { data, error } = await supabase.functions.invoke('generate-symptom-insights', {
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    });

    if (error) {
      console.error("Error generating symptom insights:", error);
      return "Unable to generate insights at the moment. Your symptom tracking shows consistent engagement with recovery monitoring!";
    }

    return data.insights || "Keep up the great work with your symptom tracking!";
  } catch (error) {
    console.error("Error in generateSymptomInsights:", error);
    return "Your symptom tracking journey is progressing well. Continue monitoring your symptoms to unlock more detailed insights!";
  }
};
