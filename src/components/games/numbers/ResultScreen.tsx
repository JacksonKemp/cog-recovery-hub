
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ResultScreenProps {
  isCorrect: boolean | null;
  numbers: string;
  userInput: string;
  onBackToIntro: () => void;
  onPlayAgain: () => void;
}

const ResultScreen = ({ 
  isCorrect, 
  numbers, 
  userInput, 
  onBackToIntro, 
  onPlayAgain 
}: ResultScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        {isCorrect ? "Correct!" : "Not correct"}
      </h2>
      
      <div className="flex justify-center mb-8">
        {isCorrect ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <X className="h-16 w-16 text-red-500" />
        )}
      </div>
      
      <div className="mb-8">
        <p className="mb-2">The correct numbers:</p>
        <div className="text-2xl font-bold">{numbers}</div>
        {!isCorrect && (
          <p className="mt-4">Your answer: <span className="font-medium">{userInput}</span></p>
        )}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBackToIntro}>
          Back
        </Button>
        <Button onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
