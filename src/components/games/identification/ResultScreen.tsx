
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ResultScreenProps {
  score: number;
  puzzlesCount: number;
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ score, puzzlesCount, onPlayAgain, onBackToIntro }: ResultScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Results: {Math.round(score)} points
      </h2>
      
      <div className="flex justify-center mb-8">
        {score / puzzlesCount >= puzzlesCount * 0.75 ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {score / puzzlesCount >= 0.5 ? "🎉" : "🤔"}
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
