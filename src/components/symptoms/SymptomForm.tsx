
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Check, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SymptomRatings, saveSymptomEntry, hasEntryForToday } from "@/services/symptomService";
import { useToast } from "@/hooks/use-toast";

// Steps for symptom tracking
type Step = "headache" | "fatigue" | "anxiety" | "focus" | "notes" | "complete";

interface SymptomFormProps {
  onEntryAdded: () => Promise<void>;
  isLoading: boolean;
  hasRecordedToday: boolean;
}

export const SymptomForm = ({ onEntryAdded, isLoading, hasRecordedToday }: SymptomFormProps) => {
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("headache");
  const { toast } = useToast();

  // Current symptom ratings
  const [symptoms, setSymptoms] = useState<SymptomRatings>({
    headache: 0,
    fatigue: 0,
    anxiety: 0,
    focus: 3
  });
  
  const [notes, setNotes] = useState("");

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
      
      // Refresh data after adding an entry
      await onEntryAdded();
      
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

  return (
    <>
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
    </>
  );
};
