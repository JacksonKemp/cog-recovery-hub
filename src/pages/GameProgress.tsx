
import { useState, useEffect } from "react";
import { Activity, Brain, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGameProgress, getMostImprovedGame, GameProgressEntry } from "@/services/gameService";
import { format, parseISO } from "date-fns";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const GameProgress = () => {
  const [selectedCategory, setSelectedCategory] = useState("memory");
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) {
      console.warn("User not authenticated in GameProgress component");
    } else {
      console.log("Authenticated user in GameProgress:", user.id);
    }
  }, [user]);
  
  const { data: progressData = [], isLoading, error } = useQuery({
    queryKey: ['gameProgress', selectedCategory],
    queryFn: () => getGameProgress(selectedCategory),
    enabled: !!user
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
    }
  }, [progressData]);
  
  const { data: mostImproved } = useQuery({
    queryKey: ['mostImproved', selectedCategory],
    queryFn: () => getMostImprovedGame(selectedCategory),
    enabled: progressData.length > 0
  });
  
  // Process data for chart
  const chartData = processChartData(progressData);
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Game Progress</h1>
          <p className="text-muted-foreground">Track your improvement across cognitive games</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button asChild variant="outline">
            <Link to="/games" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Back to Games
            </Link>
          </Button>
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
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-cog-purple" />
                        Progress Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {chartData.length > 0 ? (
                        <div className="h-[300px] w-full">
                          <ChartContainer
                            config={{
                              blue: { theme: { light: "#2563eb", dark: "#60a5fa" } }
                            }}
                          >
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tickFormatter={(date) => format(parseISO(date), 'MM/dd')} 
                              />
                              <YAxis />
                              <ChartTooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="var(--color-blue)" 
                                name="Score" 
                              />
                            </LineChart>
                          </ChartContainer>
                        </div>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground">
                          No game data available for this category yet. 
                          Play some games to see your progress!
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-cog-purple" />
                        Recent Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {progressData.length > 0 ? (
                          progressData.slice(0, 5).map((entry) => (
                            <div key={entry.id} className="flex justify-between items-center border-b pb-2">
                              <div>
                                <div className="font-medium">{formatGameName(entry.game_type)}</div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(parseISO(entry.created_at), 'MMM d, yyyy')}
                                </div>
                              </div>
                              <div className="font-bold text-lg">
                                {entry.score}
                                {entry.max_score && <span className="text-sm text-muted-foreground">/{entry.max_score}</span>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No games played in this category yet.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Insights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Most Improved</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {mostImproved ? (
                          <div>
                            <p className="text-2xl font-bold">
                              {formatGameName(mostImproved.game)}
                            </p>
                            <p className="text-muted-foreground">
                              {mostImproved.improvement} point improvement
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">Play more games to see your progress</p>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Consistency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {progressData.length > 0 ? (
                          <div>
                            <p className="text-2xl font-bold">
                              {progressData.length} sessions
                            </p>
                            <p className="text-muted-foreground">
                              Keep playing to build your streak
                            </p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No games played yet</p>
                        )}
                      </CardContent>
                    </Card>
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

// Helper function to format game names for display
function formatGameName(gameType: string): string {
  const gameNames: Record<string, string> = {
    'numbers': 'Numbers Game',
    'names': 'Names Game',
    'faces': 'Faces Game',
    'rgb': 'RGB Game',
    'word-finder': 'Word Finder',
    'identification': 'Identification',
    'then-what': 'Then What',
    'word-searches': 'Word Searches',
    'sudoku': 'Sudoku',
    'memory-match': 'Memory Match'
  };
  
  return gameNames[gameType] || gameType;
}

// Process data for the chart
function processChartData(data: GameProgressEntry[]): any[] {
  if (!data || data.length === 0) return [];
  
  // Group by game type and date
  const groupedByGame: Record<string, Record<string, GameProgressEntry[]>> = {};
  
  data.forEach(entry => {
    if (!groupedByGame[entry.game_type]) {
      groupedByGame[entry.game_type] = {};
    }
    
    // Format date to group by day
    const dateStr = entry.created_at.split('T')[0];
    
    if (!groupedByGame[entry.game_type][dateStr]) {
      groupedByGame[entry.game_type][dateStr] = [];
    }
    
    groupedByGame[entry.game_type][dateStr].push(entry);
  });
  
  // Create chart data by averaging scores for each game type per day
  const chartData: Array<{date: string; score: number; game: string}> = [];
  
  Object.entries(groupedByGame).forEach(([gameType, dates]) => {
    Object.entries(dates).forEach(([date, entries]) => {
      // Calculate average score for this game on this date
      const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
      const avgScore = Math.round(totalScore / entries.length);
      
      chartData.push({
        date,
        score: avgScore,
        game: formatGameName(gameType)
      });
    });
  });
  
  // Sort by date
  return chartData.sort((a, b) => a.date.localeCompare(b.date));
}

export default GameProgress;
