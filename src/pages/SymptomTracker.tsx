
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LineChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SymptomEntry, hasEntryForToday, getRecentEntries } from "@/services/symptomService";
import { useAuth } from "@/hooks/use-auth";

// Import the refactored components
import { SymptomForm } from "@/components/symptoms/SymptomForm";
import { SymptomChart } from "@/components/symptoms/SymptomChart";
import { RecentEntries } from "@/components/symptoms/RecentEntries";
import { InsightPanel } from "@/components/symptoms/InsightPanel";

const SymptomTracker = () => {
  const [selectedTab, setSelectedTab] = useState("track");
  const [recentEntries, setRecentEntries] = useState<SymptomEntry[]>([]);
  const [hasRecordedToday, setHasRecordedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  // Load data on component mount
  useEffect(() => {
    console.log("[DEBUG] SymptomTracker useEffect triggered", { user: user?.id, authLoading });
    
    if (!authLoading && user) {
      console.log("[DEBUG] Calling loadData for user:", user.id);
      loadData();
    } else if (!authLoading && !user) {
      console.log("[DEBUG] No user, setting loading to false");
      setIsLoading(false);
    }
  }, [user, authLoading]);

  // Function to load data
  const loadData = async () => {
    if (!user) {
      console.log("[DEBUG] No user found, skipping data load");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("[DEBUG] Starting data load for user:", user.id);
    
    try {
      // Check if the user has already recorded symptoms today
      const hasEntry = await hasEntryForToday();
      console.log("[DEBUG] loadData ▸ hasEntry =", hasEntry);
      setHasRecordedToday(hasEntry);
      
      // Get recent entries
      const entries = await getRecentEntries();
      console.log("[DEBUG] loadData ▸ entries =", entries);
      setRecentEntries(entries);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Failed to load symptoms",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log("[DEBUG] Data loading completed");
    }
  };
  
  // Handle entry added - refresh data
  const handleEntryAdded = async () => {
    console.log("[DEBUG] Entry added, refreshing data");
    await loadData();
  };

  // Show loading while auth is loading
  if (authLoading) {
    console.log("[DEBUG] Showing auth loading state");
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show auth required message if not authenticated
  if (!user) {
    console.log("[DEBUG] Showing auth required state");
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please sign in to track your symptoms.</p>
          </div>
        </div>
      </div>
    );
  }

  console.log("[DEBUG] Rendering main component", { isLoading, hasRecordedToday, entriesCount: recentEntries.length });

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
          <SymptomForm 
            onEntryAdded={handleEntryAdded} 
            isLoading={isLoading} 
            hasRecordedToday={hasRecordedToday} 
          />
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SymptomChart isLoading={isLoading} />
            {isLoading ? (
              <RecentEntries isLoading={isLoading} entries={recentEntries} />
            ) : recentEntries.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-muted-foreground col-span-1">
                <p>No symptom entries yet</p>
                <p className="text-sm">Tap "Track Symptoms" above to add the first one.</p>
              </div>
            ) : (
              <RecentEntries isLoading={isLoading} entries={recentEntries} />
            )}
          </div>
          
          <InsightPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SymptomTracker;
