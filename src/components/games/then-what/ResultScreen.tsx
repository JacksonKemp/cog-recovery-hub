
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { GameResult } from "@/hooks/games/useThenWhatGame";

interface ResultScreenProps {
  averageScore: number;
  totalRounds: number;
  results: GameResult[];
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ 
  averageScore, 
  totalRounds, 
  results, 
  onPlayAgain, 
  onBackToIntro 
}: ResultScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Results: {averageScore}% Average Accuracy
      </h2>
      
      <div className="flex justify-center mb-8">
        {averageScore >= 80 ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {averageScore >= 60 ? "🎉" : "🤔"}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-lg font-medium mb-2">
          You completed {totalRounds} rounds
        </p>
        <p className="text-muted-foreground">
          Average accuracy: {averageScore}%
        </p>
      </div>
      
      <div className="flex justify-center gap-4 mb-8">
        <Button variant="outline" onClick={onBackToIntro}>
          Back
        </Button>
        <Button onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>

      <div className="text-left">
        <h3 className="text-xl font-semibold mb-4 text-center">Review Your Performance</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {result.accuracyScore >= 60 ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  Round {index + 1} - {result.accuracyScore}% Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Original Instruction:
                    </p>
                    <p className="text-sm bg-blue-50 p-2 rounded">
                      {result.originalInstruction}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Your Response:
                    </p>
                    <p className="text-sm bg-gray-50 p-2 rounded">
                      {result.userResponse || "No response provided"}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Feedback:
                    </p>
                    <p className="text-sm text-blue-600">
                      {result.feedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
