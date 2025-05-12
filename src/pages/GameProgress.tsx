
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGameProgress, getMostImprovedGame, GameProgressEntry } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { DebugPanel } from "@/components/game-progress/DebugPanel";
import { ProgressChart, processChartData } from "@/components/game-progress/ProgressChart";
import { RecentPerformance } from "@/components/game-progress/RecentPerformance";
import { InsightsPanel } from "@/components/game-progress/InsightsPanel";

const GameProgress = () => {
  const [selectedCategory, setSelectedCategory] = useState("memory");
  const { user } = useAuth();
  const [isDebugVisible, setIsDebugVisible] = useState(false);
  
  useEffect(() => {
    if (!user) {
      console.warn("User not authenticated in GameProgress component");
      toast.error("You must be signed in to view game progress");
    } else {
      console.log("Authenticated user in GameProgress:", user.id);
    }
  }, [user]);
  
  const { data: progressData = [], isLoading, error, refetch } = useQuery({
    queryKey: ['gameProgress', selectedCategory],
    queryFn: () => getGameProgress(selectedCategory),
    enabled: !!user,
    retry: 1
  });
  
  useEffect(() => {
    if (error) {
      console.error("Error in game progress query:", error);
      toast.error("Failed to load game progress");
    }
  }, [error]);
  
  useEffect(() => {
    if (progressData && progressData.length > 0) {
      console.log("Loaded game progress data:", progressData.length, "entries");
    } else {
      console.log("No game progress data found");
    }
  }, [progressData]);
  
  const { data: mostImproved } = useQuery({
    queryKey: ['mostImproved', selectedCategory],
    queryFn: () => getMostImprovedGame(selectedCategory),
    enabled: progressData.length > 0
  });

  // Toggle debug panel
  const toggleDebugPanel = () => {
    setIsDebugVisible(!isDebugVisible);
  };
  
  // Process data for chart
  const chartData = processChartData(progressData);
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Game Progress</h1>
          <p className="text-muted-foreground">Track your improvement across cognitive games</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button asChild variant="outline">
            <Link to="/games" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Back to Games
            </Link>
          </Button>
          
          <DebugPanel 
            isDebugVisible={isDebugVisible}
            toggleDebugPanel={toggleDebugPanel}
            user={user}
            progressData={progressData}
            refetch={refetch}
          />
        </div>
      </div>
      
      <Tabs defaultValue="memory" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="attention">Attention</TabsTrigger>
          <TabsTrigger value="processing">Processing Speed</TabsTrigger>
        </TabsList>
        
        {["memory", "attention", "processing"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            {isLoading ? (
              <div className="text-center py-10">Loading your progress data...</div>
            ) : (
              <>
                <ProgressChart chartData={chartData} />
                <RecentPerformance progressData={progressData} />
                <InsightsPanel 
                  mostImproved={mostImproved} 
                  progressData={progressData} 
                />
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GameProgress;
