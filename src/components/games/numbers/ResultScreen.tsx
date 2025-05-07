
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ResultScreenProps {
  isCorrect: boolean | null;
  numbers: string;
  userInput: string;
  score: number;
  onBackToIntro: () => void;
  onPlayAgain: () => void;
}

const ResultScreen = ({ 
  isCorrect, 
  numbers, 
  userInput, 
  score,
  onBackToIntro, 
  onPlayAgain 
}: ResultScreenProps) => {
  // Calculate how many digits were correct
  const correctCount = numbers.split('').filter((digit, index) => 
    userInput[index] === digit
  ).length;
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        {isCorrect ? "Correct!" : "Not correct"}
      </h2>
      
      <div className="flex justify-center mb-4">
        {isCorrect ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <X className="h-16 w-16 text-red-500" />
        )}
      </div>
      
      <div className="mb-4">
        <p className="mb-1">Score</p>
        <div className="flex items-center gap-2 justify-center">
          <Progress value={score} className="w-48 h-2" />
          <span className="text-xl font-bold">{score}%</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {correctCount} of {numbers.length} digits correct
        </p>
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
