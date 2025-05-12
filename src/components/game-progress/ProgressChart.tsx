
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { format, parseISO } from "date-fns";
import { GameProgressEntry } from "@/services/game";

interface ProgressChartProps {
  chartData: any[];
}

export const ProgressChart = ({ chartData }: ProgressChartProps) => {
  return (
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
  );
};

// Helper function to process data for the chart
export function processChartData(data: GameProgressEntry[]): any[] {
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
