
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { verifyPractitionerAccess, PatientData, clearPractitionerAccess } from "@/services/practitionerAuthService";
import { getPractitionerViewGameProgress } from "@/services/practitionerViewService";
import { getPractitionerViewSymptoms } from "@/services/practitionerViewService";
import { GameProgressEntry } from "@/services/gameService";
import { SymptomEntry } from "@/services/practitionerViewService";
import { Brain, Activity, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const PractitionerDashboard = () => {
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgressEntry[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const accessCode = localStorage.getItem('practitioner_access_code');
        if (!accessCode) {
          toast.error("No access code found");
          navigate("/practitioner");
          return;
        }

        const patientData = await verifyPractitionerAccess(accessCode);
        if (!patientData) {
          toast.error("Invalid or expired access code");
          navigate("/practitioner");
          return;
        }

        setPatient(patientData);

        // Fetch game progress
        const progress = await getPractitionerViewGameProgress(patientData.id);
        setGameProgress(progress);

        // Fetch symptoms
        const symptomData = await getPractitionerViewSymptoms(patientData.id);
        setSymptoms(symptomData);
      } catch (error) {
        console.error("Error validating access:", error);
        toast.error("Failed to validate access");
        navigate("/practitioner");
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();
  }, [navigate]);

  const handleSignOut = () => {
    clearPractitionerAccess();
    navigate("/practitioner");
    toast.success("Successfully signed out");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-cog-teal border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Access Error</p>
          <p className="text-muted-foreground mb-4">Unable to verify access to patient data.</p>
          <Button onClick={() => navigate("/practitioner")}>Return to Login</Button>
        </div>
      </div>
    );
  }

  // Group game progress by type for analysis
  const gameStats = gameProgress.reduce((acc, entry) => {
    if (!acc[entry.game_type]) {
      acc[entry.game_type] = [];
    }
    acc[entry.game_type].push(entry);
    return acc;
  }, {} as Record<string, GameProgressEntry[]>);

  // Calculate the average score for each game type
  const gameAverages = Object.entries(gameStats).map(([gameType, entries]) => {
    const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = totalScore / entries.length;
    const latestScore = entries[0].score; // Assuming entries are sorted by date desc
    
    return {
      gameType,
      averageScore,
      latestScore,
      sessionsCount: entries.length,
      trend: entries.length > 1 ? (latestScore > entries[1].score ? "improving" : "declining") : "stable"
    };
  });

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <Link 
            to="/practitioner" 
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
          </Link>
          <h1 className="text-2xl font-bold flex items-center">
            Patient: {patient.fullName || patient.email}
          </h1>
          <p className="text-sm text-muted-foreground">Practitioner View - Limited Access Mode</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-grid md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive Progress</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cog-teal" />
                  Cognitive Exercises
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gameProgress.length > 0 ? (
                    <>
                      <p className="text-sm">
                        The patient has completed <span className="font-bold">{gameProgress.length}</span> cognitive exercises.
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Recent Activity</div>
                        <div className="bg-muted/30 rounded-md p-3">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Last exercise:</div>
                            <div className="font-medium">{gameProgress[0]?.game_type || "None"}</div>
                            <div>Date:</div>
                            <div className="font-medium">
                              {gameProgress[0]?.created_at 
                                ? format(new Date(gameProgress[0].created_at), 'MMM d, yyyy')
                                : "N/A"
                              }
                            </div>
                            <div>Score:</div>
                            <div className="font-medium">{gameProgress[0]?.score || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No cognitive exercise data available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cog-teal" />
                  Symptoms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {symptoms.length > 0 ? (
                    <>
                      <p className="text-sm">
                        The patient has logged <span className="font-bold">{symptoms.length}</span> symptom entries.
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Latest Symptoms</div>
                        <div className="bg-muted/30 rounded-md p-3">
                          {symptoms[0] && (
                            <>
                              <div className="text-xs text-muted-foreground mb-2">
                                {format(new Date(symptoms[0].created_at), 'MMM d, yyyy')}
                              </div>
                              <div className="space-y-1">
                                {Object.entries(symptoms[0].symptoms).map(([symptom, level]) => (
                                  <div key={symptom} className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="capitalize">{symptom.replace(/_/g, ' ')}:</div>
                                    <div className="font-medium">{level}/10</div>
                                  </div>
                                ))}
                              </div>
                              {symptoms[0].notes && (
                                <div className="mt-3 text-sm">
                                  <div className="font-medium">Notes:</div>
                                  <div className="text-xs mt-1 text-muted-foreground">{symptoms[0].notes}</div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">No symptom data available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="cognitive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cognitive Exercise Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {gameProgress.length > 0 ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Progress Summary by Game Type</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Game Type</TableHead>
                          <TableHead>Sessions</TableHead>
                          <TableHead>Latest Score</TableHead>
                          <TableHead>Average Score</TableHead>
                          <TableHead>Trend</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gameAverages.map((stat) => (
                          <TableRow key={stat.gameType}>
                            <TableCell className="font-medium capitalize">
                              {stat.gameType.replace(/_/g, ' ')}
                            </TableCell>
                            <TableCell>{stat.sessionsCount}</TableCell>
                            <TableCell>{stat.latestScore.toFixed(1)}</TableCell>
                            <TableCell>{stat.averageScore.toFixed(1)}</TableCell>
                            <TableCell>
                              <span 
                                className={`text-xs px-2 py-1 rounded-full ${
                                  stat.trend === 'improving' 
                                    ? 'bg-cog-light-teal text-cog-teal' 
                                    : stat.trend === 'declining' 
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {stat.trend.charAt(0).toUpperCase() + stat.trend.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">All Game Sessions</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Game Type</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Time (s)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {gameProgress.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(new Date(entry.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="capitalize">
                              {entry.game_type.replace(/_/g, ' ')}
                            </TableCell>
                            <TableCell>{entry.category}</TableCell>
                            <TableCell>{entry.score}</TableCell>
                            <TableCell>{entry.level || 'N/A'}</TableCell>
                            <TableCell>{entry.time_taken ? `${entry.time_taken}s` : 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No cognitive exercise data available for this patient.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="symptoms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Symptom History</CardTitle>
            </CardHeader>
            <CardContent>
              {symptoms.length > 0 ? (
                <div className="space-y-4">
                  {symptoms.map((entry) => (
                    <div key={entry.id} className="bg-muted/30 rounded-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-sm font-medium">
                          {format(new Date(entry.created_at), 'MMM d, yyyy - h:mm a')}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(entry.symptoms).map(([symptom, level]) => (
                          <div key={symptom} className="bg-background p-3 rounded-md">
                            <div className="text-xs text-muted-foreground mb-1 capitalize">
                              {symptom.replace(/_/g, ' ')}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{level}/10</div>
                              <div 
                                className="flex-1 h-2 rounded-full bg-muted"
                                style={{
                                  background: `linear-gradient(90deg, ${
                                    level <= 3 ? 'var(--cog-teal)' : level <= 6 ? 'orange' : 'red'
                                  } ${level * 10}%, var(--muted) ${level * 10}%)`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      {entry.notes && (
                        <div className="mt-4 p-3 bg-background rounded-md">
                          <div className="text-xs text-muted-foreground mb-1">Notes</div>
                          <div className="text-sm">{entry.notes}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No symptom data available for this patient.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PractitionerDashboard;
