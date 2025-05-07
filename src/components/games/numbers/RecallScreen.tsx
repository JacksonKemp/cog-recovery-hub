
import { Button } from "@/components/ui/button";

interface RecallScreenProps {
  userInput: string;
  onUserInputChange: (value: string) => void;
  onCheckAnswer: () => void;
  onCancel: () => void;
}

const RecallScreen = ({ 
  userInput, 
  onUserInputChange, 
  onCheckAnswer, 
  onCancel 
}: RecallScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">Enter the numbers</h2>
      
      <div className="mb-8">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full max-w-xs p-4 text-center text-2xl border rounded-md"
          value={userInput}
          onChange={(e) => onUserInputChange(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onCheckAnswer} 
          disabled={!userInput.length}
        >
          Check Answer
        </Button>
      </div>
    </div>
  );
};

export default RecallScreen;
