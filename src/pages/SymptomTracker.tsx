
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Plus, LineChart, ArrowDown, ArrowUp, Minus, Check, Loader2 } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { SymptomEntry, SymptomRatings, hasEntryForToday, saveSymptomEntry, getRecentEntries } from "@/services/symptomService";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  // Week 1
  { date: "Week 1", headache: 3, fatigue: 3, anxiety: 2, focus: 2 },
  // Week 2
  { date: "Week 2", headache: 2, fatigue: 2, anxiety: 1, focus: 3 },
  // Week 3
  { date: "Week 3", headache: 2, fatigue: 2, anxiety: 1, focus: 3 },
  // Week 4
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

// Steps for symptom tracking
type Step = "headache" | "fatigue" | "anxiety" | "focus" | "notes" | "complete";
type TimeFrame = "week" | "month" | "year" | "all";

const SymptomTracker = () => {
  const [selectedTab, setSelectedTab] = useState("track");
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("headache");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("week");
  const [selectedDataPoint, setSelectedDataPoint] = useState<number | null>(null);
  const { toast } = useToast();

  // Current symptom ratings
  const [symptoms, setSymptoms] = useState<SymptomRatings>({
    headache: 0,
    fatigue: 0,
    anxiety: 0,
    focus: 3
  });
  
  const [notes, setNotes] = useState("");
  const [recentEntries, setRecentEntries] = useState<SymptomEntry[]>([]);
  const [hasRecordedToday, setHasRecordedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Get chart data based on selected timeframe
  const getChartData = () => {
    switch (timeFrame) {
      case "week":
        return lastWeekData;
      case "month":
        return lastMonthData;
      case "year":
        return lastYearData;
      case "all":
        return lastYearData; // Using year data for 'all' as well for this demo
      default:
        return lastWeekData;
    }
  };

  const chartData = getChartData();

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Check if the user has already recorded symptoms today
        const hasEntry = await hasEntryForToday();
        setHasRecordedToday(hasEntry);
        
        // Get recent entries
        const entries = await getRecentEntries();
        setRecentEntries(entries);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load your symptom data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  // Set the initial selected data point when chart data changes
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setSelectedDataPoint(0);
    }
  }, [chartData]);

  const handleSymptomChange = (symptom: keyof SymptomRatings, value: number) => {
    setSymptoms({ ...symptoms, [symptom]: value });
    
    // Automatically advance to next step on selection
    if (symptom === "headache") {
      setCurrentStep("fatigue");
    } else if (symptom === "fatigue") {
      setCurrentStep("anxiety");
    } else if (symptom === "anxiety") {
      setCurrentStep("focus");
    } else if (symptom === "focus") {
      setCurrentStep("notes");
    }
  };

  const handleDataPointClick = (data: any, index: number) => {
    setSelectedDataPoint(index);
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case "notes":
        setCurrentStep("complete");
        handleSaveEntry();
        break;
      case "complete":
        resetForm();
        setIsFlowOpen(false);
        break;
    }
  };

  const handlePrevStep = () => {
    switch (currentStep) {
      case "fatigue":
        setCurrentStep("headache");
        break;
      case "anxiety":
        setCurrentStep("fatigue");
        break;
      case "focus":
        setCurrentStep("anxiety");
        break;
      case "notes":
        setCurrentStep("focus");
        break;
    }
  };

  const resetForm = () => {
    setSymptoms({ headache: 0, fatigue: 0, anxiety: 0, focus: 3 });
    setNotes("");
    setCurrentStep("headache");
  };

  const startSymptomFlow = () => {
    resetForm();
    setIsFlowOpen(true);
  };

  const handleSaveEntry = async () => {
    try {
      await saveSymptomEntry(symptoms, notes);
      
      // Update the UI state
      setHasRecordedToday(true);
      
      // Refresh the recent entries
      const entries = await getRecentEntries();
      setRecentEntries(entries);
      
      toast({
        title: "Symptoms recorded",
        description: "Your symptoms have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your symptoms",
        variant: "destructive"
      });
    }
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

  const getTrendIcon = (currentValue: number, previousValue: number) => {
    if (currentValue < previousValue) {
      return <ArrowDown className="h-4 w-4 text-green-500" />;
    } else if (currentValue > previousValue) {
      return <ArrowUp className="h-4 w-4 text-red-500" />;
    }
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  // Configure chart colors and labels
  const chartConfig = {
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

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Symptom Tracker</h1>
          <p className="text-muted-foreground">Monitor your symptoms and track recovery progress</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="track">
            <Plus className="h-4 w-4 mr-2" />
            Track Symptoms
          </TabsTrigger>
          <TabsTrigger value="history">
            <LineChart className="h-4 w-4 mr-2" />
            History & Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="track" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Track your symptoms to monitor your recovery</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {isLoading ? (
                <div className="flex flex-col items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Loading your data...</p>
                </div>
              ) : hasRecordedToday ? (
                <div className="text-center py-4">
                  <div className="bg-primary/10 text-primary p-4 rounded-md mb-4 flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    <p>You've already recorded your symptoms today.</p>
                  </div>
                  <p className="text-muted-foreground">
                    Come back tomorrow to continue tracking your recovery.
                  </p>
                </div>
              ) : (
                <Button 
                  onClick={startSymptomFlow} 
                  className="w-full max-w-md"
                  size="lg"
                >
                  <Plus className="mr-2" /> Start Recording Symptoms
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                              activeDot={{ r: 6, onClick: (_, index) => setSelectedDataPoint(index) }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="fatigue" 
                              name="Fatigue"
                              stroke={chartConfig.fatigue.color} 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6, onClick: (_, index) => setSelectedDataPoint(index) }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="anxiety" 
                              name="Anxiety"
                              stroke={chartConfig.anxiety.color} 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6, onClick: (_, index) => setSelectedDataPoint(index) }}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="focus" 
                              name="Focus"
                              stroke={chartConfig.focus.color} 
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6, onClick: (_, index) => setSelectedDataPoint(index) }}
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

            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Your latest symptom records</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : recentEntries.length > 0 ? (
                  <div className="space-y-4">
                    {recentEntries.map((entry) => (
                      <div key={entry.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-cog-purple" />
                            <span className="font-medium">{entry.date}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                            <span>Headache:</span>
                            <div className="flex items-center">
                              {entry.symptoms.headache}
                              {recentEntries[1] && getTrendIcon(
                                entry.symptoms.headache,
                                recentEntries[1].symptoms.headache
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                            <span>Fatigue:</span>
                            <div className="flex items-center">
                              {entry.symptoms.fatigue}
                              {recentEntries[1] && getTrendIcon(
                                entry.symptoms.fatigue,
                                recentEntries[1].symptoms.fatigue
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                            <span>Anxiety:</span>
                            <div className="flex items-center">
                              {entry.symptoms.anxiety}
                              {recentEntries[1] && getTrendIcon(
                                entry.symptoms.anxiety,
                                recentEntries[1].symptoms.anxiety
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                            <span>Focus:</span>
                            <div className="flex items-center">
                              {entry.symptoms.focus}
                              {recentEntries[1] && getTrendIcon(
                                entry.symptoms.focus,
                                recentEntries[1].symptoms.focus
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-2 italic">
                            "{entry.notes}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No symptom entries yet. Start tracking to see your history here.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 rounded-lg bg-cog-light-purple">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Activity className="h-6 w-6 text-cog-purple" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Recovery Insights</h3>
                <p className="text-muted-foreground max-w-xl">
                  Your headache and fatigue symptoms have been improving over the last week. 
                  Focus and concentration continue to show positive trends.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Symptom Flow Dialog */}
      <Dialog open={isFlowOpen} onOpenChange={setIsFlowOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentStep === "complete" ? "Symptoms Recorded" : `Rate your ${currentStep}`}
            </DialogTitle>
          </DialogHeader>

          {currentStep === "headache" && (
            <div className="py-4 space-y-4">
              <h3 className="mb-4 font-medium text-center">Headache Intensity</h3>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSymptomChange("headache", i)}
                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                      symptoms.headache === i ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl font-bold mb-2">{i}</span>
                    {i === 0 && <span className="text-sm text-muted-foreground">None</span>}
                    {i === 5 && <span className="text-sm text-muted-foreground">Severe</span>}
                    {i !== 0 && i !== 5 && <span className="text-sm text-muted-foreground">&nbsp;</span>}
                  </button>
                ))}
              </div>
              {symptoms.headache > 0 && (
                <p className="text-center mt-4">
                  Selected: <span className="font-medium">{symptoms.headache}</span> - {getRatingLabel(symptoms.headache, "headache")}
                </p>
              )}
            </div>
          )}

          {currentStep === "fatigue" && (
            <div className="py-4 space-y-4">
              <h3 className="mb-4 font-medium text-center">Fatigue Level</h3>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSymptomChange("fatigue", i)}
                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                      symptoms.fatigue === i ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl font-bold mb-2">{i}</span>
                    {i === 0 && <span className="text-sm text-muted-foreground">None</span>}
                    {i === 5 && <span className="text-sm text-muted-foreground">Severe</span>}
                    {i !== 0 && i !== 5 && <span className="text-sm text-muted-foreground">&nbsp;</span>}
                  </button>
                ))}
              </div>
              {symptoms.fatigue > 0 && (
                <p className="text-center mt-4">
                  Selected: <span className="font-medium">{symptoms.fatigue}</span> - {getRatingLabel(symptoms.fatigue, "fatigue")}
                </p>
              )}
            </div>
          )}

          {currentStep === "anxiety" && (
            <div className="py-4 space-y-4">
              <h3 className="mb-4 font-medium text-center">Anxiety Level</h3>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSymptomChange("anxiety", i)}
                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                      symptoms.anxiety === i ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl font-bold mb-2">{i}</span>
                    {i === 0 && <span className="text-sm text-muted-foreground">None</span>}
                    {i === 5 && <span className="text-sm text-muted-foreground">Severe</span>}
                    {i !== 0 && i !== 5 && <span className="text-sm text-muted-foreground">&nbsp;</span>}
                  </button>
                ))}
              </div>
              {symptoms.anxiety > 0 && (
                <p className="text-center mt-4">
                  Selected: <span className="font-medium">{symptoms.anxiety}</span> - {getRatingLabel(symptoms.anxiety, "anxiety")}
                </p>
              )}
            </div>
          )}

          {currentStep === "focus" && (
            <div className="py-4 space-y-4">
              <h3 className="mb-4 font-medium text-center">Focus & Concentration</h3>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSymptomChange("focus", i)}
                    className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 transition-colors ${
                      symptoms.focus === i ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl font-bold mb-2">{i}</span>
                    {i === 0 && <span className="text-sm text-muted-foreground">Poor</span>}
                    {i === 5 && <span className="text-sm text-muted-foreground">Excellent</span>}
                    {i !== 0 && i !== 5 && <span className="text-sm text-muted-foreground">&nbsp;</span>}
                  </button>
                ))}
              </div>
              {symptoms.focus > 0 && (
                <p className="text-center mt-4">
                  Selected: <span className="font-medium">{symptoms.focus}</span> - {getRatingLabel(symptoms.focus, "focus")}
                </p>
              )}
            </div>
          )}

          {currentStep === "notes" && (
            <div className="py-4">
              <h3 className="mb-4 font-medium">Additional Notes (Optional)</h3>
              <textarea 
                className="w-full min-h-[100px] p-3 border rounded-md" 
                placeholder="Add any additional notes about how you're feeling..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
              <div className="mt-4 flex justify-center">
                <Button onClick={handleNextStep}>
                  Save
                </Button>
              </div>
            </div>
          )}

          {currentStep === "complete" && (
            <div className="py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-lg font-medium">Your symptoms have been recorded</p>
              <p className="text-sm text-muted-foreground mt-2">
                Thank you for tracking your symptoms. This helps monitor your recovery progress.
              </p>
              <div className="mt-4">
                <Button onClick={handleNextStep}>
                  Done
                </Button>
              </div>
            </div>
          )}

          {currentStep !== "headache" && currentStep !== "complete" && (
            <DialogFooter className="flex justify-between sm:justify-between mt-4">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SymptomTracker;
