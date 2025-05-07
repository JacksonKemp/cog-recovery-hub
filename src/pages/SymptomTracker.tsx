
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Plus, LineChart, ArrowDown, ArrowUp, Minus, Check } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

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
    symptoms: { headache: 1, fatigue: 2, anxiety: 1, focus: 4 },
    notes: "Felt better after afternoon rest."
  },
  {
    id: "2",
    date: "Yesterday",
    symptoms: { headache: 2, fatigue: 3, anxiety: 0, focus: 3 },
    notes: "Mild headache in the morning."
  },
  {
    id: "3",
    date: format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), "MMM d, yyyy"),
    symptoms: { headache: 2, fatigue: 3, anxiety: 1, focus: 3 },
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
    focus: 3
  });
  
  const [notes, setNotes] = useState("");

  const handleSymptomChange = (symptom: keyof typeof symptoms, value: number) => {
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
                    <YAxis domain={[0, 5]} />
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
                              entry.id === "1" ? recentEntries[1].symptoms.headache : 3
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                          <span>Fatigue:</span>
                          <div className="flex items-center">
                            {entry.symptoms.fatigue}
                            {getTrendIcon(
                              entry.symptoms.fatigue,
                              entry.id === "1" ? recentEntries[1].symptoms.fatigue : 3
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                          <span>Anxiety:</span>
                          <div className="flex items-center">
                            {entry.symptoms.anxiety}
                            {getTrendIcon(
                              entry.symptoms.anxiety,
                              entry.id === "1" ? recentEntries[1].symptoms.anxiety : 1
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm bg-white rounded p-1.5">
                          <span>Focus:</span>
                          <div className="flex items-center">
                            {entry.symptoms.focus}
                            {getTrendIcon(
                              entry.symptoms.focus,
                              entry.id === "1" ? recentEntries[1].symptoms.focus : 3
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
