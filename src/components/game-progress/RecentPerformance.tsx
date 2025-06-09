
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { GameProgressEntry } from "@/services/game";
import { formatGameName } from "./ProgressChart";

interface RecentPerformanceProps {
  progressData: GameProgressEntry[];
}

export const RecentPerformance = ({ progressData }: RecentPerformanceProps) => {
  const calculatePercentage = (score: number, maxScore: number | null): string => {
    if (!maxScore || maxScore === 0) return `${score}`;
    const percentage = Math.round((score / maxScore) * 100);
    return `${percentage}%`;
  };

  return (
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
                    {calculatePercentage(entry.score, entry.max_score)}
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
  );
};
