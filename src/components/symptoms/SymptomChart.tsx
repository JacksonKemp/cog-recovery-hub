import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { getSymptomChartData, ChartDataPoint } from "@/services/symptomChartService";
import { useToast } from "@/hooks/use-toast";

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

export const SymptomChart = ({ isLoading: parentLoading }: SymptomChartProps) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("week");
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

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

  // Load chart data when timeframe changes
  useEffect(() => {
    loadChartData();
  }, [timeFrame]);

  const loadChartData = async () => {
    setIsLoadingData(true);
    try {
      console.log("[DEBUG] Loading chart data for timeframe:", timeFrame);
      const data = await getSymptomChartData(timeFrame);
      console.log("[DEBUG] Chart data loaded:", data);
      setChartData(data);
      
      // Set initial selected data point
      if (data.length > 0) {
        setSelectedDataPoint(data.length - 1); // Select the most recent data point
      }
    } catch (error) {
      console.error("Error loading chart data:", error);
      toast({
        title: "Error loading chart data",
        description: "Failed to load your symptom data for the chart",
        variant: "destructive"
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  // Handle timeframe change
  const handleTimeFrameChange = (value: TimeFrame) => {
    setTimeFrame(value);
  };

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

  const isLoading = parentLoading || isLoadingData;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 pb-3">
        <div>
          <CardTitle className="text-lg">Symptom Trends</CardTitle>
          <CardDescription className="text-sm">Track how your symptoms have changed over time</CardDescription>
        </div>
        <div className="w-full max-w-[200px]">
          <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
            <SelectTrigger className="text-sm">
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
      <CardContent className="px-3 pb-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <p className="text-base font-medium">No symptom data available</p>
            <p className="text-xs">Start tracking your symptoms to see trends here</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-48 w-full overflow-hidden">
              <ChartContainer 
                className="h-full w-full"
                config={chartConfig}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart 
                    data={chartData}
                    margin={{ top: 10, right: 5, left: 5, bottom: 20 }}
                    onClick={(data) => {
                      if (data.activeTooltipIndex !== undefined) {
                        handleDataPointClick(data, data.activeTooltipIndex);
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      label={{ 
                        value: getTimeframeLabel(), 
                        position: 'insideBottom', 
                        offset: -10,
                        fontSize: 10
                      }}
                    />
                    <YAxis 
                      domain={[0, 5]}
                      tick={{ fontSize: 10 }}
                      label={{ 
                        value: getYAxisLabel(), 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle' },
                        fontSize: 10
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
                      wrapperStyle={{ paddingBottom: 10, fontSize: 10 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="headache" 
                      name="Headache"
                      stroke={chartConfig.headache.color} 
                      strokeWidth={2}
                      dot={{ r: 2 }}
                      activeDot={{ 
                        r: 4, 
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
                      dot={{ r: 2 }}
                      activeDot={{ 
                        r: 4, 
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
                      dot={{ r: 2 }}
                      activeDot={{ 
                        r: 4, 
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
                      dot={{ r: 2 }}
                      activeDot={{ 
                        r: 4, 
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
              <div className="p-3 border rounded-lg bg-background shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-base">{chartData[selectedDataPoint].date}</h3>
                  <span className="text-xs text-muted-foreground">{getTimeframeLabel()}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.headache.color}}></div>
                      <span className="text-xs font-medium">Headache:</span>
                    </div>
                    <span className="text-lg font-semibold">{chartData[selectedDataPoint].headache}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRatingLabel(chartData[selectedDataPoint].headache, "headache")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.fatigue.color}}></div>
                      <span className="text-xs font-medium">Fatigue:</span>
                    </div>
                    <span className="text-lg font-semibold">{chartData[selectedDataPoint].fatigue}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRatingLabel(chartData[selectedDataPoint].fatigue, "fatigue")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.anxiety.color}}></div>
                      <span className="text-xs font-medium">Anxiety:</span>
                    </div>
                    <span className="text-lg font-semibold">{chartData[selectedDataPoint].anxiety}</span>
                    <span className="text-xs text-muted-foreground">
                      {getRatingLabel(chartData[selectedDataPoint].anxiety, "anxiety")}
                    </span>
                  </div>
                  
                  <div className="flex flex-col p-2 bg-muted/30 rounded border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: chartConfig.focus.color}}></div>
                      <span className="text-xs font-medium">Focus:</span>
                    </div>
                    <span className="text-lg font-semibold">{chartData[selectedDataPoint].focus}</span>
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
