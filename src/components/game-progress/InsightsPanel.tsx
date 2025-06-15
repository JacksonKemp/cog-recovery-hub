import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameProgressEntry } from "@/services/game";
import { Brain, TrendingUp, Target } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { generateInsights } from "@/services/game/insightsService";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfWeek, addWeeks, startOfDay, isWithinInterval } from "date-fns";

interface InsightsPanelProps {
  mostImproved: { game: string; improvement: number } | null;
  progressData: GameProgressEntry[];
}

type WeeklyPerformancePoint = {
  weekStart: Date;
  avgScore: number;
  label: string;
};

function computeWeeklyPerformance(data: GameProgressEntry[]) : WeeklyPerformancePoint[] {
  if (!data.length) return [];

  // Find the date range for last 6 months
  const now = new Date();
  const sixMonthsAgo = addWeeks(now, -26);

  // Group scores per week
  let weeklyMap: Record<string, number[]> = {};
  data.forEach(entry => {
    if (!entry.created_at) return;
    const entryDate = new Date(entry.created_at);
    if (entryDate < sixMonthsAgo || entryDate > now) return;
    // Use start of week (Monday) for bucket
    const week = startOfWeek(entryDate, { weekStartsOn: 1 }).toISOString();
    if (!weeklyMap[week]) weeklyMap[week] = [];
    // Convert score to percentage
    let perc = entry.max_score && entry.max_score > 0 ? (entry.score / entry.max_score) * 100 : entry.score;
    weeklyMap[week].push(perc);
  });

  // Create complete week buckets even where there is no data
  let allWeeks: WeeklyPerformancePoint[] = [];
  for (
    let week = startOfWeek(sixMonthsAgo, { weekStartsOn: 1 });
    week <= now;
    week = addWeeks(week, 1)
  ) {
    const weekISO = week.toISOString();
    const avg = weeklyMap[weekISO] && weeklyMap[weekISO].length
      ? Math.round(
          weeklyMap[weekISO].reduce((sum, x) => sum + x, 0) / weeklyMap[weekISO].length
        )
      : null;
    allWeeks.push({
      weekStart: week,
      avgScore: avg ?? null,
      label: format(week, "MMM d"),
    });
  }
  return allWeeks;
}

function getTrendText(points: WeeklyPerformancePoint[]) {
  // Only use non-null avg scores
  const nonNullPoints = points.filter(pt => pt.avgScore !== null);
  if (nonNullPoints.length < 2) return "Not enough data";
  // Compute slope: (last - first) / number of weeks
  const first = nonNullPoints[0].avgScore!;
  const last = nonNullPoints[nonNullPoints.length - 1].avgScore!;
  const numWeeks = nonNullPoints.length - 1;
  const change = last - first;
  const perMonth = (change / numWeeks) * 4.33; // 4.33 weeks/month
  if (Math.abs(perMonth) < 0.5) return "Stable scores";
  if (perMonth > 0) return `Improving (+${perMonth.toFixed(1)}%/mo)`;
  return `Declining (${perMonth.toFixed(1)}%/mo)`;
}

export const InsightsPanel = ({ mostImproved, progressData }: InsightsPanelProps) => {
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const aiInsights = await generateInsights();
        setInsights(aiInsights);
      } catch (error) {
        console.error("Failed to generate insights:", error);
        setInsights("Continue your cognitive training journey to unlock personalized insights!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [progressData]);

  // Calculate 6-month rolling stats and weekly performance
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const sixMonthData = progressData.filter(entry => 
    new Date(entry.created_at) >= sixMonthsAgo
  );

  const totalSessions = sixMonthData.length;
  const recentSessions = sixMonthData.slice(0, 10).length;

  // Calculate consistency (games played per week over 6 months)
  const weeksInPeriod = Math.ceil((Date.now() - sixMonthsAgo.getTime()) / (7 * 24 * 60 * 60 * 1000));
  const avgSessionsPerWeek = totalSessions / Math.max(weeksInPeriod, 1);

  // Calculate weekly average scores for the graph
  const weeklyPerf = useMemo(
    () => computeWeeklyPerformance(sixMonthData),
    [sixMonthData]
  );
  const trendText = getTrendText(weeklyPerf);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">6-Month Performance Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cog-purple" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{insights}</p>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cog-purple" />
                Rolling Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* New 6-month performance line chart */}
              <div className="h-[100px] w-full mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyPerf}>
                    <XAxis
                      dataKey="label"
                      fontSize={10}
                      interval="preserveStartEnd"
                      minTickGap={20}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      hide
                    />
                    <Tooltip 
                      formatter={(value) => `${value}%`}
                      labelFormatter={(label) => `Week of ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      dot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Trend summary */}
              <div className="mb-2 flex items-center gap-2 text-cog-teal font-medium text-sm">
                {trendText}
              </div>
              {/* Keep image-inspired stats below */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Sessions (6mo)</span>
                  <span className="font-medium">{totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Recent Activity</span>
                  <span className="font-medium">{recentSessions} recent sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-cog-purple" />
                Consistency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-2xl font-bold">
                  {avgSessionsPerWeek.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  sessions per week average
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
