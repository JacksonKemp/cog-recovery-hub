
import { useState, useEffect } from "react";
import { Activity, Loader2 } from "lucide-react";
import { generateSymptomInsights } from "@/services/symptomInsightsService";
import { useAuth } from "@/hooks/use-auth";

export const InsightPanel = () => {
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadInsights();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadInsights = async () => {
    setIsLoading(true);
    try {
      const insightText = await generateSymptomInsights();
      setInsights(insightText);
    } catch (error) {
      console.error("Error loading insights:", error);
      setInsights("Keep tracking your symptoms consistently to unlock personalized recovery insights!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="mt-8 p-6 rounded-lg bg-cog-light-purple">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-6 w-6 text-cog-purple animate-spin" />
          ) : (
            <Activity className="h-6 w-6 text-cog-purple" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">Recovery Insights</h3>
          <p className="text-muted-foreground max-w-xl">
            {isLoading ? "Analyzing your symptom data..." : insights}
          </p>
        </div>
      </div>
    </div>
  );
};
