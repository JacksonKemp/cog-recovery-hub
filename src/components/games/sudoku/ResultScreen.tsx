
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ResultScreenProps {
  isValid: boolean;
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ isValid, onPlayAgain, onBackToIntro }: ResultScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        {isValid ? "Puzzle Solved!" : "Not Quite Right"}
      </h2>
      
      <div className="flex justify-center mb-8">
        {isValid ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <X className="h-16 w-16 text-red-500" />
        )}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBackToIntro}>
          Back
        </Button>
        <Button onClick={onPlayAgain}>
          New Game
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
