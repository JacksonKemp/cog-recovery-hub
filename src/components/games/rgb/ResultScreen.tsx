

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ResultScreenProps {
  score: number;
  missedCount: number;
  gameDuration: number;
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ 
  score, 
  missedCount,
  gameDuration,
  onPlayAgain, 
  onBackToIntro 
}: ResultScreenProps) => {
  const totalAttempts = score + missedCount;
  const accuracy = totalAttempts > 0 ? ((score / totalAttempts) * 100).toFixed(1) : "0";
  const reactionRate = (totalAttempts / (gameDuration / 60)).toFixed(1); // total reactions per minute
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Game Complete!
      </h2>
      
      <div className="flex justify-center mb-8">
        {score >= 30 ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {score >= 15 ? "🎉" : "🤔"}
          </div>
        )}
      </div>
      
      <div className="mb-6 space-y-3">
        <div className="flex justify-center gap-8 mb-4">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            <span className="text-lg font-medium">{score} correct</span>
          </div>
          <div className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-500" />
            <span className="text-lg font-medium">{missedCount} missed</span>
          </div>
        </div>
        
        <p className="text-lg font-medium">
          Accuracy: {accuracy}%
        </p>
        <p className="text-muted-foreground">
          Reaction Rate: {reactionRate} per minute
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

