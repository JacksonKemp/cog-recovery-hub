
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Plus, LineChart, ArrowDown, ArrowUp, Minus, Check } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Sample data for charts
const lastWeekData = [
  { date: "Mon", headache: 8, fatigue: 7, anxiety: 4, focus: 3 },
  { date: "Tue", headache: 7, fatigue: 6, anxiety: 3, focus: 4 },
  { date: "Wed", headache: 5, fatigue: 5, anxiety: 2, focus: 5 },
  { date: "Thu", headache: 6, fatigue: 4, anxiety: 3, focus: 6 },
  { date: "Fri", headache: 4, fatigue: 5, anxiety: 2, focus: 6 },
  { date: "Sat", headache: 3, fatigue: 3, anxiety: 1, focus: 7 },
  { date: "Sun", headache: 2, fatigue: 4, anxiety: 2, focus: 7 },
];

// Type for symptom entry
type SymptomEntry = {
  id: string;
  date: string;
  symptoms: {
    headache: number;
    fatigue: number;
    anxiety: number;
    focus: number;
  };
  notes: string;
};

// Recent entries
const recentEntries: SymptomEntry[] = [
  {
    id: "1",
    date: "Today",
    symptoms: { headache: 2, fatigue: 4, anxiety: 2, focus: 7 },
    notes: "Felt better after afternoon rest."
  },
  {
    id: "2",
    date: "Yesterday",
    symptoms: { headache: 3, fatigue: 5, anxiety: 1, focus: 6 },
    notes: "Mild headache in the morning."
  },
  {
    id: "3",
    date: format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "MMM d, yyyy"),
    symptoms: { headache: 4, fatigue: 5, anxiety: 2, focus: 6 },
    notes: "More tired than usual."
  },
];

// Steps for symptom tracking
type Step = "headache" | "fatigue" | "anxiety" | "focus" | "notes" | "complete";

const SymptomTracker = () => {
  const [selectedTab, setSelectedTab] = useState("track");
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("headache");
  const { toast } = useToast();

  // Current symptom ratings
  const [symptoms, setSymptoms] = useState({
    headache: 0,
    fatigue: 0,
    anxiety: 0,
    focus: 5
  });
  
  const [notes, setNotes] = useState("");

  const handleSymptomChange = (symptom: keyof typeof symptoms, value: number) => {
    setSymptoms({ ...symptoms, [symptom]: value });
  };

  const handleNextStep = () => {
    switch (currentStep) {
      case "headache":
        setCurrentStep("fatigue");
        break;
      case "fatigue":
        setCurrentStep("anxiety");
        break;
      case "anxiety":
        setCurrentStep("focus");
        break;
      case "focus":
        setCurrentStep("notes");
        break;
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
    setSymptoms({ headache: 0, fatigue: 0, anxiety: 0, focus: 5 });
    setNotes("");
    setCurrentStep("headache");
  };

  const startSymptomFlow = () => {
    resetForm();
    setIsFlowOpen(true);
  };

  const handleSaveEntry = () => {
    // Would save the entry here in a real app
    console.log("Saving entry:", { symptoms, notes, date: new Date() });
    
    toast({
      title: "Symptoms recorded",
      description: "Your symptoms have been saved successfully.",
    });
  };

  const getRatingLabel = (value: number, type: string) => {
    if (type === "focus") {
      if (value <= 3) return "Poor";
      if (value <= 6) return "Fair";
      return "Good";
    } else {
      if (value === 0) return "None";
      if (value <= 3) return "Mild";
      if (value <= 6) return "Moderate";
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
              <Button 
                onClick={startSymptomFlow} 
                className="w-full max-w-md"
                size="lg"
              >
                <Plus className="mr-2" /> Start Recording Symptoms
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Symptom Trends</CardTitle>
                <CardDescription>Track how your symptoms have changed over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lastWeekData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHeadache" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFatigue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="headache" stroke="#8884d8" fillOpacity={1} fill="url(#colorHeadache)" />
                    <Area type="monotone" dataKey="fatigue" stroke="#82ca9d" fillOpacity={1} fill="url(#colorFatigue)" />
                    <Area type="monotone" dataKey="anxiety" stroke="#ffc658" fillOpacity={1} fill="url(#colorAnxiety)" />
                    <Area type="monotone" dataKey="focus" stroke="#9b87f5" fillOpacity={1} fill="url(#colorFocus)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Entries</CardTitle>
                <CardDescription>Your latest symptom records</CardDescription>
              </CardHeader>
              <CardContent>
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
                            {getTrendIcon(
                              entry.symptoms.headache,
                              entry.id === "1" ? recentEntries[1].symptoms.headache : 5
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                          <span>Fatigue:</span>
                          <div className="flex items-center">
                            {entry.symptoms.fatigue}
                            {getTrendIcon(
                              entry.symptoms.fatigue,
                              entry.id === "1" ? recentEntries[1].symptoms.fatigue : 6
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                          <span>Anxiety:</span>
                          <div className="flex items-center">
                            {entry.symptoms.anxiety}
                            {getTrendIcon(
                              entry.symptoms.anxiety,
                              entry.id === "1" ? recentEntries[1].symptoms.anxiety : 3
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                          <span>Focus:</span>
                          <div className="flex items-center">
                            {entry.symptoms.focus}
                            {getTrendIcon(
                              entry.symptoms.focus,
                              entry.id === "1" ? recentEntries[1].symptoms.focus : 5
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
            <div className="py-4">
              <h3 className="mb-4 font-medium">Headache Intensity</h3>
              <RadioGroup 
                value={symptoms.headache.toString()}
                onValueChange={(value) => handleSymptomChange("headache", parseInt(value))}
                className="grid grid-cols-5 gap-2"
              >
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <RadioGroupItem value={i.toString()} id={`headache-${i}`} className="mx-auto" />
                    <label htmlFor={`headache-${i}`} className="text-sm mt-1">{i}</label>
                    {i === 0 && <span className="text-xs text-muted-foreground">None</span>}
                    {i === 10 && <span className="text-xs text-muted-foreground">Severe</span>}
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-center mt-4">
                Selected: <span className="font-medium">{symptoms.headache}</span> - {getRatingLabel(symptoms.headache, "headache")}
              </p>
            </div>
          )}

          {currentStep === "fatigue" && (
            <div className="py-4">
              <h3 className="mb-4 font-medium">Fatigue Level</h3>
              <RadioGroup 
                value={symptoms.fatigue.toString()}
                onValueChange={(value) => handleSymptomChange("fatigue", parseInt(value))}
                className="grid grid-cols-5 gap-2"
              >
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <RadioGroupItem value={i.toString()} id={`fatigue-${i}`} className="mx-auto" />
                    <label htmlFor={`fatigue-${i}`} className="text-sm mt-1">{i}</label>
                    {i === 0 && <span className="text-xs text-muted-foreground">None</span>}
                    {i === 10 && <span className="text-xs text-muted-foreground">Severe</span>}
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-center mt-4">
                Selected: <span className="font-medium">{symptoms.fatigue}</span> - {getRatingLabel(symptoms.fatigue, "fatigue")}
              </p>
            </div>
          )}

          {currentStep === "anxiety" && (
            <div className="py-4">
              <h3 className="mb-4 font-medium">Anxiety Level</h3>
              <RadioGroup 
                value={symptoms.anxiety.toString()}
                onValueChange={(value) => handleSymptomChange("anxiety", parseInt(value))}
                className="grid grid-cols-5 gap-2"
              >
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <RadioGroupItem value={i.toString()} id={`anxiety-${i}`} className="mx-auto" />
                    <label htmlFor={`anxiety-${i}`} className="text-sm mt-1">{i}</label>
                    {i === 0 && <span className="text-xs text-muted-foreground">None</span>}
                    {i === 10 && <span className="text-xs text-muted-foreground">Severe</span>}
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-center mt-4">
                Selected: <span className="font-medium">{symptoms.anxiety}</span> - {getRatingLabel(symptoms.anxiety, "anxiety")}
              </p>
            </div>
          )}

          {currentStep === "focus" && (
            <div className="py-4">
              <h3 className="mb-4 font-medium">Focus & Concentration</h3>
              <RadioGroup 
                value={symptoms.focus.toString()}
                onValueChange={(value) => handleSymptomChange("focus", parseInt(value))}
                className="grid grid-cols-5 gap-2"
              >
                {[...Array(11)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <RadioGroupItem value={i.toString()} id={`focus-${i}`} className="mx-auto" />
                    <label htmlFor={`focus-${i}`} className="text-sm mt-1">{i}</label>
                    {i === 0 && <span className="text-xs text-muted-foreground">Poor</span>}
                    {i === 10 && <span className="text-xs text-muted-foreground">Excellent</span>}
                  </div>
                ))}
              </RadioGroup>
              <p className="text-sm text-center mt-4">
                Selected: <span className="font-medium">{symptoms.focus}</span> - {getRatingLabel(symptoms.focus, "focus")}
              </p>
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
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
            {currentStep !== "headache" && currentStep !== "complete" ? (
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            <Button onClick={handleNextStep}>
              {currentStep === "notes" ? "Save" : 
               currentStep === "complete" ? "Done" : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SymptomTracker;
