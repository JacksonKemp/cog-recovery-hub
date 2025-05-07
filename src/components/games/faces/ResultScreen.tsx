
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ResultScreenProps {
  score: number;
  questionsCount: number;
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ 
  score, 
  questionsCount, 
  onPlayAgain, 
  onBackToIntro 
}: ResultScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Results: {score} out of {questionsCount}
      </h2>
      
      <div className="flex justify-center mb-8">
        {score === questionsCount ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {score / questionsCount >= 0.5 ? "🎉" : "🤔"}
          </div>
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
