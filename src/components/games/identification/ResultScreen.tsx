
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ResultScreenProps {
  score: number;
  puzzlesCount: number;
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ score, puzzlesCount, onPlayAgain, onBackToIntro }: ResultScreenProps) => {
  // Calculate max possible score (assuming average of 4 correct answers per puzzle)
  const maxPossibleScore = puzzlesCount * 4; // This is an approximation
  const percentage = Math.round((score / maxPossibleScore) * 100);
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Results: {score.toFixed(1)} / {maxPossibleScore} points
      </h2>
      
      <div className="flex justify-center mb-8">
        {percentage >= 75 ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {percentage >= 50 ? "🎉" : "🤔"}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-lg font-medium mb-2">
          Accuracy: {percentage}%
        </p>
        <p className="text-muted-foreground">
          You scored {score.toFixed(1)} out of {maxPossibleScore} possible points
        </p>
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
