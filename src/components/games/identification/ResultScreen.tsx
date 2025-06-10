
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { PuzzleResult } from "@/hooks/games/useIdentificationGame";

interface ResultScreenProps {
  score: number;
  puzzlesCount: number;
  puzzleResults: PuzzleResult[];
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ score, puzzlesCount, puzzleResults, onPlayAgain, onBackToIntro }: ResultScreenProps) => {
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
      
      <div className="flex justify-center gap-4 mb-8">
        <Button variant="outline" onClick={onBackToIntro}>
          Back
        </Button>
        <Button onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>

      <div className="text-left">
        <h3 className="text-xl font-semibold mb-4 text-center">Review Your Answers</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {puzzleResults.map((result, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {result.isCorrect ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                  Question {index + 1}
                  <span className="text-sm font-normal text-muted-foreground">
                    ({result.score.toFixed(1)} points)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {result.puzzle.instruction}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {result.puzzle.options.map((option, optionIndex) => {
                    const isCorrectAnswer = result.puzzle.correctIndices.includes(optionIndex);
                    const wasSelected = result.selectedIndices.includes(optionIndex);
                    
                    let className = "px-3 py-2 rounded text-sm border ";
                    
                    if (isCorrectAnswer && wasSelected) {
                      // Correct answer that was selected
                      className += "bg-green-100 border-green-300 text-green-800";
                    } else if (isCorrectAnswer && !wasSelected) {
                      // Correct answer that was missed
                      className += "bg-yellow-100 border-yellow-300 text-yellow-800";
                    } else if (!isCorrectAnswer && wasSelected) {
                      // Wrong answer that was selected
                      className += "bg-red-100 border-red-300 text-red-800";
                    } else {
                      // Correctly not selected
                      className += "bg-gray-50 border-gray-200 text-gray-600";
                    }
                    
                    return (
                      <div key={optionIndex} className={className}>
                        {option}
                        {isCorrectAnswer && wasSelected && " ✓"}
                        {isCorrectAnswer && !wasSelected && " (missed)"}
                        {!isCorrectAnswer && wasSelected && " ✗"}
                      </div>
                    );
                  })}
                </div>
                {!result.isCorrect && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Correct answers: {result.puzzle.correctIndices.length}</p>
                    <p>Your selections: {result.selectedIndices.length}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
