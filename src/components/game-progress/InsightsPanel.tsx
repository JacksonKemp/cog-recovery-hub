
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameProgressEntry } from "@/services/game";
import { formatGameName } from "./ProgressChart";

interface InsightsPanelProps {
  mostImproved: { game: string; improvement: number } | null;
  progressData: GameProgressEntry[];
}

export const InsightsPanel = ({ mostImproved, progressData }: InsightsPanelProps) => {
  return (
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
  );
};
