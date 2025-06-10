
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ResultScreenProps {
  score: number;
  gameDuration: number;
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ 
  score, 
  gameDuration,
  onPlayAgain, 
  onBackToIntro 
}: ResultScreenProps) => {
  const reactionRate = (score / (gameDuration / 60)).toFixed(1); // reactions per minute
  
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
      
      <div className="mb-6 space-y-2">
        <p className="text-xl font-medium">
          Final Score: {score} correct taps
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
