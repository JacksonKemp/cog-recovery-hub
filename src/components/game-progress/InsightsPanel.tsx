
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameProgressEntry } from "@/services/game";
import { Brain, TrendingUp, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { generateInsights } from "@/services/game/insightsService";
import { Skeleton } from "@/components/ui/skeleton";

interface InsightsPanelProps {
  mostImproved: { game: string; improvement: number } | null;
  progressData: GameProgressEntry[];
}

export const InsightsPanel = ({ mostImproved, progressData }: InsightsPanelProps) => {
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const aiInsights = await generateInsights();
        setInsights(aiInsights);
      } catch (error) {
        console.error("Failed to generate insights:", error);
        setInsights("Continue your cognitive training journey to unlock personalized insights!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [progressData]);

  // Calculate 6-month rolling stats
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const sixMonthData = progressData.filter(entry => 
    new Date(entry.created_at) >= sixMonthsAgo
  );

  const totalSessions = sixMonthData.length;
  const recentSessions = sixMonthData.slice(0, 10).length;
  
  // Calculate consistency (games played per week over 6 months)
  const weeksInPeriod = Math.ceil((Date.now() - sixMonthsAgo.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const avgSessionsPerWeek = totalSessions / Math.max(weeksInPeriod, 1);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">6-Month Performance Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cog-purple" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{insights}</p>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cog-purple" />
                Rolling Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sessions (6mo)</span>
                  <span className="font-medium">{totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Recent Activity</span>
                  <span className="font-medium">{recentSessions} recent sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-cog-purple" />
                Consistency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-2xl font-bold">
                  {avgSessionsPerWeek.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  sessions per week average
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
