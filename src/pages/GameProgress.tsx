
import { useState } from "react";
import { Activity, Brain, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock data for progress statistics
// In a real app, this would come from a database
const mockProgressData = {
  memory: [
    { date: "2024-05-01", game: "Numbers", score: 85 },
    { date: "2024-05-03", game: "Numbers", score: 90 },
    { date: "2024-05-05", game: "Names", score: 75 },
    { date: "2024-05-07", game: "Names", score: 82 }
  ],
  attention: [
    { date: "2024-05-02", game: "Faces", score: 70 },
    { date: "2024-05-04", game: "RGB", score: 65 },
    { date: "2024-05-06", game: "Word Finder", score: 80 }
  ],
  processing: [
    { date: "2024-05-01", game: "Then What", score: 60 },
    { date: "2024-05-05", game: "Sudoku", score: 75 }
  ]
};

const GameProgress = () => {
  const [selectedCategory, setSelectedCategory] = useState("memory");
  
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
                    {mockProgressData[category as keyof typeof mockProgressData].length > 0 ? (
                      mockProgressData[category as keyof typeof mockProgressData].map((entry, index) => (
                        <div key={index} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <div className="font-medium">{entry.game}</div>
                            <div className="text-sm text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {entry.date}
                            </div>
                          </div>
                          <div className="font-bold text-lg">
                            {entry.score}<span className="text-sm text-muted-foreground">/100</span>
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
                    {mockProgressData[category as keyof typeof mockProgressData].length > 0 ? (
                      <div>
                        <p className="text-2xl font-bold">
                          {mockProgressData[category as keyof typeof mockProgressData][0].game}
                        </p>
                        <p className="text-muted-foreground">
                          15% improvement over the last month
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
                    {mockProgressData[category as keyof typeof mockProgressData].length > 0 ? (
                      <div>
                        <p className="text-2xl font-bold">
                          {mockProgressData[category as keyof typeof mockProgressData].length} sessions
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
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GameProgress;
