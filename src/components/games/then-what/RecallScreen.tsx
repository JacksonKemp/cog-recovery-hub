
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface RecallScreenProps {
  currentRound: number;
  totalRounds: number;
  userResponse: string;
  onResponseChange: (response: string) => void;
  onSubmitAnswer: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const RecallScreen = ({ 
  currentRound,
  totalRounds,
  userResponse, 
  onResponseChange, 
  onSubmitAnswer, 
  onCancel,
  isLoading
}: RecallScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">
        Recall the Instruction ({currentRound + 1} of {totalRounds})
      </h2>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-lg font-medium mb-4">
            Type the instruction you were given as accurately as possible:
          </p>
          
          <Textarea
            value={userResponse}
            onChange={(e) => onResponseChange(e.target.value)}
            placeholder="Enter the instruction you remember..."
            className="min-h-[120px] text-base"
            disabled={isLoading}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmitAnswer}
          disabled={!userResponse.trim() || isLoading}
        >
          {isLoading ? "Judging..." : (currentRound + 1 < totalRounds ? "Next Round" : "Finish")}
        </Button>
      </div>
    </div>
  );
};

export default RecallScreen;
