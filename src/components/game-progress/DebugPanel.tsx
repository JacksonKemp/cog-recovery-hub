
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug } from "lucide-react";
import { testSaveGameProgress } from "@/services/game";

interface DebugPanelProps {
  isDebugVisible: boolean;
  toggleDebugPanel: () => void;
  user: any | null;
  progressData: any[];
  refetch: () => void;
}

export const DebugPanel = ({ isDebugVisible, toggleDebugPanel, user, progressData, refetch }: DebugPanelProps) => {
  // Function to run test save
  const handleTestSave = async () => {
    try {
      await testSaveGameProgress();
      refetch(); // Refetch data after test save
    } catch (error) {
      console.error("Test save error:", error);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleDebugPanel}
        className="ml-2"
        title="Debug Tools"
      >
        <Bug className="h-4 w-4" />
      </Button>
      
      {isDebugVisible && (
        <Card className="mb-6 border-orange-300 bg-orange-50 dark:bg-orange-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-600">Debug Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <p><strong>User:</strong> {user ? `Authenticated (${user.id})` : 'Not authenticated'}</p>
                <p><strong>Game data count:</strong> {progressData.length} entries</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleTestSave} variant="default">
                  Test Save Game Data
                </Button>
                <Button onClick={() => refetch()} variant="outline">
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
