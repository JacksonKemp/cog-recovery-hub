
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import { GameProgressEntry } from "@/services/game";

interface ProgressChartProps {
  chartData: any[];
}

export const ProgressChart = ({ chartData }: ProgressChartProps) => {
  // Group data by game
  const gameData = chartData.reduce((acc, entry) => {
    if (!acc[entry.game]) {
      acc[entry.game] = [];
    }
    acc[entry.game].push(entry);
    return acc;
  }, {} as Record<string, any[]>);

  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", 
    "#d084d0", "#87d068", "#ffb347", "#dda0dd", "#98d982"
  ];

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cog-purple" />
            Game Score Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(gameData).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(gameData).map(([gameName, data], index) => (
                <div key={gameName} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">{gameName}</h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={(data as any[]).sort((a, b) => a.date.localeCompare(b.date))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(parseISO(date), 'MM/dd')} 
                        />
                        <YAxis 
                          domain={[0, 100]}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score"
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
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
  );
};

// Helper function to process data for the chart
export function processChartData(data: GameProgressEntry[]): any[] {
  if (!data || data.length === 0) return [];
  
  // Group by date first, then by game
  const groupedByDate: Record<string, Record<string, GameProgressEntry[]>> = {};
  
  data.forEach(entry => {
    const dateStr = entry.created_at.split('T')[0];
    
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = {};
    }
    
    const gameType = formatGameName(entry.game_type);
    if (!groupedByDate[dateStr][gameType]) {
      groupedByDate[dateStr][gameType] = [];
    }
    
    groupedByDate[dateStr][gameType].push(entry);
  });
  
  // Create chart data with separate entries for each game on each date
  const chartData: Array<{date: string; score: number; game: string}> = [];
  
  Object.entries(groupedByDate).forEach(([date, gamesByDate]) => {
    Object.entries(gamesByDate).forEach(([gameType, entries]) => {
      // Calculate average score for this game on this date
      const totalScore = entries.reduce((sum, entry) => {
        if (entry.max_score && entry.max_score > 0) {
          return sum + (entry.score / entry.max_score) * 100;
        }
        return sum + entry.score;
      }, 0);
      const avgScore = Math.round(totalScore / entries.length);
      
      chartData.push({
        date,
        score: avgScore,
        game: gameType
      });
    });
  });
  
  // Sort by date
  return chartData.sort((a, b) => a.date.localeCompare(b.date));
}

// Helper function to format game names for display
export function formatGameName(gameType: string): string {
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
    'memory-match': 'Memory Match',
    'test-game': 'Test Game'
  };
  
  return gameNames[gameType] || gameType;
}
