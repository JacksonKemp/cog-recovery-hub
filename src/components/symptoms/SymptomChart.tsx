
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";

type TimeFrame = "week" | "month" | "year" | "all";

// Chart configuration type
type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  }
};

interface SymptomChartProps {
  isLoading: boolean;
}

// Sample data for charts
const lastWeekData = [
  { date: "Mon", headache: 4, fatigue: 3, anxiety: 2, focus: 1 },
  { date: "Tue", headache: 3, fatigue: 3, anxiety: 1, focus: 2 },
  { date: "Wed", headache: 2, fatigue: 2, anxiety: 1, focus: 3 },
  { date: "Thu", headache: 3, fatigue: 2, anxiety: 1, focus: 3 },
  { date: "Fri", headache: 2, fatigue: 3, anxiety: 1, focus: 3 },
  { date: "Sat", headache: 1, fatigue: 1, anxiety: 0, focus: 4 },
  { date: "Sun", headache: 1, fatigue: 2, anxiety: 1, focus: 4 },
];

const lastMonthData = [
  { date: "Week 1", headache: 3, fatigue: 3, anxiety: 2, focus: 2 },
  { date: "Week 2", headache: 2, fatigue: 2, anxiety: 1, focus: 3 },
  { date: "Week 3", headache: 2, fatigue: 2, anxiety: 1, focus: 3 },
  { date: "Week 4", headache: 1, fatigue: 1, anxiety: 1, focus: 4 },
];

const lastYearData = [
  { date: "Jan", headache: 4, fatigue: 4, anxiety: 3, focus: 1 },
  { date: "Feb", headache: 4, fatigue: 3, anxiety: 3, focus: 2 },
  { date: "Mar", headache: 3, fatigue: 3, anxiety: 2, focus: 2 },
  { date: "Apr", headache: 3, fatigue: 2, anxiety: 2, focus: 3 },
  { date: "May", headache: 2, fatigue: 2, anxiety: 1, focus: 3 },
  { date: "Jun", headache: 2, fatigue: 2, anxiety: 1, focus: 3 },
  { date: "Jul", headache: 1, fatigue: 1, anxiety: 1, focus: 4 },
  { date: "Aug", headache: 1, fatigue: 1, anxiety: 0, focus: 4 },
  { date: "Sep", headache: 1, fatigue: 1, anxiety: 0, focus: 4 },
  { date: "Oct", headache: 1, fatigue: 1, anxiety: 0, focus: 4 },
  { date: "Nov", headache: 0, fatigue: 1, anxiety: 0, focus: 5 },
  { date: "Dec", headache: 0, fatigue: 0, anxiety: 0, focus: 5 },
];

export const SymptomChart = ({ isLoading }: SymptomChartProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("week");
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(null);

  // Configure chart colors and labels
  const chartConfig: ChartConfig = {
    headache: { 
      label: "Headache", 
      color: "#8884d8", 
    },
    fatigue: { 
      label: "Fatigue", 
      color: "#82ca9d", 
    },
    anxiety: { 
      label: "Anxiety", 
      color: "#ffc658", 
    },
    focus: { 
      label: "Focus", 
      color: "#9b87f5", 
    },
  };

  // Get chart data based on selected timeframe
  const getChartData = () => {
    switch (timeFrame) {
      case "week":
        return lastWeekData;
      case "month":
        return lastMonthData;
      case "year":
      case "all":
        return lastYearData; // Using year data for 'all' as well for this demo
      default:
        return lastWeekData;
    }
  };

  const chartData = getChartData();

  // Set the initial selected data point when chart data changes
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setSelectedDataPoint(0);
    }
  }, [chartData]);

  // Fixed to correctly handle the data point index
  const handleDataPointClick = (data: any, index: number) => {
    setSelectedDataPoint(index);
  };

  // Get timeframe label
  const getTimeframeLabel = () => {
    switch(timeFrame) {
      case "week": return "Last 7 Days";
      case "month": return "Last 4 Weeks";
      case "year": return "Last 12 Months";
      case "all": return "All Time";
      default: return "Last 7 Days";
    }
  };

  // Get Y-Axis label
  const getYAxisLabel = () => {
    return "Severity (0-5)";
  };

  const getRatingLabel = (value: number, type: string) => {
    if (type === "focus") {
      if (value <= 1) return "Poor";
      if (value <= 3) return "Fair";
      return "Good";
    } else {
      if (value === 0) return "None";
      if (value <= 2) return "Mild";
      if (value <= 3) return "Moderate";
      return "Severe";
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>Symptom Trends</CardTitle>
          <CardDescription>Track how your symptoms have changed over time</CardDescription>
        </div>
        <div className="w-full md:w-40">
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-80">
              <ChartContainer 
                className="h-full"
                config={chartConfig}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart 
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    onClick={(data) => {
                      if (data.activeTooltipIndex !== undefined) {
                        handleDataPointClick(data, data.activeTooltipIndex);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: getTimeframeLabel(), 
                        position: 'insideBottom', 
                        offset: -15,
                        fontSize: 12
                      }}
                    />
                    <YAxis 
                      domain={[0, 5]}
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: getYAxisLabel(), 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' },
                        fontSize: 12
                      }}
                    />
                    <Tooltip 
                      content={<ChartTooltipContent />}
                      wrapperStyle={{ outline: "none" }}
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="top"
                      align="center"
                      content={<ChartLegendContent />}
                      wrapperStyle={{ paddingBottom: 20 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="headache" 
                      name="Headache"
                      stroke={chartConfig.headache.color} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ 
                        r: 6, 
                        onClick: (_, index) => {
                          if (typeof index === 'number') {
                            setSelectedDataPoint(index);
                          }
                        }
                      }}
                      fill="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="fatigue" 
                      name="Fatigue"
                      stroke={chartConfig.fatigue.color} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ 
                        r: 6, 
                        onClick: (_, index) => {
                          if (typeof index === 'number') {
                            setSelectedDataPoint(index);
                          }
                        }
                      }}
                      fill="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="anxiety" 
                      name="Anxiety"
                      stroke={chartConfig.anxiety.color} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ 
                        r: 6, 
                        onClick: (_, index) => {
                          if (typeof index === 'number') {
                            setSelectedDataPoint(index);
                          }
                        }
                      }}
                      fill="none"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="focus" 
                      name="Focus"
                      stroke={chartConfig.focus.color} 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ 
                        r: 6, 
                        onClick: (_, index) => {
                          if (typeof index === 'number') {
                            setSelectedDataPoint(index);
                          }
                        }
                      }}
                      fill="none"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            {/* Always visible data point details */}
            {selectedDataPoint !== null && chartData[selectedDataPoint] && (
              <div className="p-4 border rounded-lg bg-background shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{chartData[selectedDataPoint].date}</h3>
                  <span className="text-xs text-muted-foreground">{getTimeframeLabel()}</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: chartConfig.headache.color}}></div>
                      <span className="text-sm font-medium">Headache:</span>
                    </div>
                    <span className="text-xl font-semibold">{chartData[selectedDataPoint].headache}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRatingLabel(chartData[selectedDataPoint].headache, "headache")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: chartConfig.fatigue.color}}></div>
                      <span className="text-sm font-medium">Fatigue:</span>
                    </div>
                    <span className="text-xl font-semibold">{chartData[selectedDataPoint].fatigue}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRatingLabel(chartData[selectedDataPoint].fatigue, "fatigue")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: chartConfig.anxiety.color}}></div>
                      <span className="text-sm font-medium">Anxiety:</span>
                    </div>
                    <span className="text-xl font-semibold">{chartData[selectedDataPoint].anxiety}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRatingLabel(chartData[selectedDataPoint].anxiety, "anxiety")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: chartConfig.focus.color}}></div>
                      <span className="text-sm font-medium">Focus:</span>
                    </div>
                    <span className="text-xl font-semibold">{chartData[selectedDataPoint].focus}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRatingLabel(chartData[selectedDataPoint].focus, "focus")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
