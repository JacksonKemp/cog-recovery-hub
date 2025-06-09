
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { RecentPerformance } from "@/components/game-progress/RecentPerformance";
import { InsightsPanel } from "@/components/game-progress/InsightsPanel";
import { WeeklyStatsCard } from "@/components/game-progress/WeeklyStatsCard";
import { getGameProgress, getMostImprovedGame } from "@/services/game";
import { getWeeklyStats, WeeklyStats } from "@/services/game/weeklyStatsService";
import { GameProgressEntry } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const GameProgress = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [progressData, setProgressData] = useState<GameProgressEntry[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [mostImproved, setMostImproved] = useState<{ game: string; improvement: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch progress data for the selected category
        const category = activeTab === "all" ? undefined : activeTab;
        const [progress, stats, improved] = await Promise.all([
          getGameProgress(category),
          getWeeklyStats(category),
          getMostImprovedGame(category || "all")
        ]);
        
        setProgressData(progress);
        setWeeklyStats(stats);
        setMostImproved(improved);
      } catch (error) {
        console.error("Error fetching game progress data:", error);
        toast.error("Failed to load game progress data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Please Log In</h2>
              <p className="text-muted-foreground">
                You need to be logged in to view your game progress.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = ["all", "memory", "attention", "processing"];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Game Progress</h1>
        <p className="text-muted-foreground">
          Track your cognitive exercise performance over time
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {/* Weekly Stats Grid */}
                {category === "all" ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <WeeklyStatsCard stats={weeklyStats} category="memory" />
                    <WeeklyStatsCard stats={weeklyStats} category="attention" />
                    <WeeklyStatsCard stats={weeklyStats} category="processing" />
                  </div>
                ) : (
                  <WeeklyStatsCard stats={weeklyStats} category={category} />
                )}

                {/* Recent Performance and Insights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <RecentPerformance progressData={progressData} />
                  </div>
                  <div>
                    <InsightsPanel 
                      mostImproved={mostImproved} 
                      progressData={progressData} 
                    />
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GameProgress;
