
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { WeeklyStats } from "@/services/game/weeklyStatsService";
import { GameProgressEntry } from "@/services/game";
import { processChartData } from "./ProgressChart";

interface WeeklyStatsCardProps {
  stats: WeeklyStats[];
  category: string;
  progressData?: GameProgressEntry[];
}

export const WeeklyStatsCard = ({ stats, category, progressData = [] }: WeeklyStatsCardProps) => {
  const categoryStats = stats.filter(stat => stat.category === category);
  
  // Process chart data for this category
  const chartData = processChartData(progressData.filter(entry => entry.category === category));
  
  // Group chart data by game for mini charts
  const gameChartData = chartData.reduce((acc, entry) => {
    if (!acc[entry.game]) {
      acc[entry.game] = [];
    }
    acc[entry.game].push(entry);
    return acc;
  }, {} as Record<string, any[]>);

  if (categoryStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 capitalize">
            <TrendingUp className="h-5 w-5 text-cog-purple" />
            {category} Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No games played in this category yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 capitalize">
          <TrendingUp className="h-5 w-5 text-cog-purple" />
          {category} Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.slice(0, 4).map((weekStat) => (
            <div key={`${weekStat.category}-${weekStat.weekStart}`} className="border-b pb-3 last:border-b-0">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Week of {format(new Date(weekStat.weekStart), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {weekStat.gamesPlayed} games
                </div>
              </div>
              <div className="flex justify-between items-center mb-2">
                <div className="text-2xl font-bold">
                  avg score: {weekStat.averagePercentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  avg difficulty: <span className="font-medium">{weekStat.averageDifficulty}</span>
                </div>
              </div>
              
              {/* Mini chart for each game in this category */}
              {Object.entries(gameChartData).length > 0 && (
                <div className="space-y-2 mt-3">
                  {Object.entries(gameChartData).map(([gameName, data]) => (
                    <div key={gameName} className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground min-w-[100px]">
                        {gameName}:
                      </div>
                      <div className="flex-1 h-[40px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data.sort((a: any, b: any) => a.date.localeCompare(b.date))}>
                            <Line 
                              type="monotone" 
                              dataKey="score"
                              stroke="#8884d8"
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
