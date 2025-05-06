
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Calendar, Plus, LineChart, ArrowDown, ArrowUp, Minus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";

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

const SymptomTracker = () => {
  const [selectedTab, setSelectedTab] = useState("track");

  // Current symptom ratings
  const [symptoms, setSymptoms] = useState({
    headache: 0,
    fatigue: 0,
    anxiety: 0,
    focus: 5
  });
  
  const [notes, setNotes] = useState("");

  const handleSymptomChange = (symptom: keyof typeof symptoms, value: number[]) => {
    setSymptoms({ ...symptoms, [symptom]: value[0] });
  };

  const handleSaveEntry = () => {
    // Would save the entry here in a real app
    console.log("Saving entry:", { symptoms, notes, date: new Date() });
    // Reset form
    setSymptoms({ headache: 0, fatigue: 0, anxiety: 0, focus: 5 });
    setNotes("");
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
              <CardDescription>Rate your symptoms to track your recovery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">Headache Intensity</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.headache === 0 ? "None" : 
                       symptoms.headache <= 3 ? "Mild" : 
                       symptoms.headache <= 6 ? "Moderate" : "Severe"}
                    </span>
                  </div>
                  <Slider 
                    value={[symptoms.headache]} 
                    min={0} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleSymptomChange("headache", value)} 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">Fatigue Level</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.fatigue === 0 ? "None" : 
                       symptoms.fatigue <= 3 ? "Mild" : 
                       symptoms.fatigue <= 6 ? "Moderate" : "Severe"}
                    </span>
                  </div>
                  <Slider 
                    value={[symptoms.fatigue]} 
                    min={0} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleSymptomChange("fatigue", value)} 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">Anxiety Level</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.anxiety === 0 ? "None" : 
                       symptoms.anxiety <= 3 ? "Mild" : 
                       symptoms.anxiety <= 6 ? "Moderate" : "Severe"}
                    </span>
                  </div>
                  <Slider 
                    value={[symptoms.anxiety]} 
                    min={0} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleSymptomChange("anxiety", value)} 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>None</span>
                    <span>Severe</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="font-medium">Focus & Concentration</label>
                    <span className="text-sm text-muted-foreground">
                      {symptoms.focus <= 3 ? "Poor" : 
                       symptoms.focus <= 6 ? "Fair" : "Good"}
                    </span>
                  </div>
                  <Slider 
                    value={[symptoms.focus]} 
                    min={0} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => handleSymptomChange("focus", value)} 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div>
                  <label className="font-medium block mb-2">Notes</label>
                  <textarea 
                    className="w-full min-h-[100px] p-3 border rounded-md" 
                    placeholder="Add any additional notes about how you're feeling..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  ></textarea>
                </div>

                <Button className="w-full" onClick={handleSaveEntry}>Save Today's Entry</Button>
              </div>
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
    </div>
  );
};

export default SymptomTracker;
