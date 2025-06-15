import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { format, parseISO, isSameMonth } from "date-fns";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { WeeklyStats } from "@/services/game/weeklyStatsService";
import { GameProgressEntry } from "@/services/game";
import { processChartData } from "./ProgressChart";

interface WeeklyStatsCardProps {
  stats: WeeklyStats[];
  category: string;
  progressData?: GameProgressEntry[];
}

interface ChartDataPoint {
  date: string;
  score: number;
  game: string;
}

export const WeeklyStatsCard = ({ stats, category, progressData = [] }: WeeklyStatsCardProps) => {
  const categoryStats = stats.filter(stat => stat.category === category);
  
  // Process chart data for this category
  const allChartData = processChartData(progressData.filter(entry => entry.category === category));

  // Only keep score history for current month (for minimal sparkline)
  const now = new Date();
  const monthlyChartData = allChartData.filter(point => 
    isSameMonth(parseISO(point.date), now)
  );

  // Combine all games for this category in the sparkline (if possible)
  // For multi-game days, use the daily average
  const dailyAvgDataMap: Record<string, { total: number; count: number }> = {};
  monthlyChartData.forEach(point => {
    if (!dailyAvgDataMap[point.date]) {
      dailyAvgDataMap[point.date] = { total: 0, count: 0 };
    }
    dailyAvgDataMap[point.date].total += point.score;
    dailyAvgDataMap[point.date].count += 1;
  });
  const dailyAvgData = Object.entries(dailyAvgDataMap)
    .map(([date, res]) => ({ date, score: Math.round(res.total / res.count) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Group chart data by game for mini charts (not for main sparkline)
  const gameChartData = allChartData.reduce((acc, entry) => {
    if (!acc[entry.game]) {
      acc[entry.game] = [];
    }
    acc[entry.game].push(entry);
    return acc;
  }, {} as Record<string, ChartDataPoint[]>);

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
        <div className="space-y-6">
          {categoryStats.slice(0, 4).map((weekStat) => (
            <div key={`${weekStat.category}-${weekStat.weekStart}`} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Week of {format(new Date(weekStat.weekStart), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {weekStat.gamesPlayed} games
                </div>
              </div>
              
              {/* Main summary line */}
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  avg score: {weekStat.averagePercentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  avg difficulty: <span className="font-medium">{weekStat.averageDifficulty}</span>
                </div>
              </div>

              {/* Simple sparkline for this category's score trend (month only) */}
              <div className="h-[48px] w-full mt-2 mb-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyAvgData}>
                    <XAxis
                      dataKey="date"
                      hide
                    />
                    <YAxis
                      domain={[0, 100]}
                      hide
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Games with individual mini charts */}
              {Object.entries(gameChartData).length > 0 && (
                <div className="space-y-3">
                  {Object.entries(gameChartData).map(([gameName, gameData]: [string, ChartDataPoint[]]) => (
                    <div key={gameName} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-semibold">
                          {gameName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          avg difficulty: <span className="font-medium">{weekStat.averageDifficulty}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">
                          avg score: {weekStat.averagePercentage}%
                        </div>
                      </div>
                      
                      {/* Mini chart for this game */}
                      <div className="h-[60px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={gameData.sort((a, b) => a.date.localeCompare(b.date))}>
                            <Line 
                              type="monotone" 
                              dataKey="score"
                              stroke="#8884d8"
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Fallback when no chart data available */}
              {Object.entries(gameChartData).length === 0 && (
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold">
                    avg score: {weekStat.averagePercentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    avg difficulty: <span className="font-medium">{weekStat.averageDifficulty}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
