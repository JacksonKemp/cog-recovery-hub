
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { WeeklyStats } from "@/services/game/weeklyStatsService";

interface WeeklyStatsCardProps {
  stats: WeeklyStats[];
  category: string;
}

export const WeeklyStatsCard = ({ stats, category }: WeeklyStatsCardProps) => {
  const categoryStats = stats.filter(stat => stat.category === category);
  
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
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Week of {format(new Date(weekStat.weekStart), 'MMM d, yyyy')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {weekStat.gamesPlayed} games
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  avg: {weekStat.averagePercentage}%
                </div>
                <div className="text-sm text-muted-foreground">
                  avg difficulty: <span className="font-medium">{weekStat.averageDifficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
