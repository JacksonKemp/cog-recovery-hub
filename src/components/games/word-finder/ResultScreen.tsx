
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { PuzzleResult } from "@/hooks/games/useWordFinderGame";

interface ResultScreenProps {
  score: number;
  totalPuzzles: number;
  puzzleResults: PuzzleResult[];
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ 
  score, 
  totalPuzzles,
  puzzleResults,
  onPlayAgain, 
  onBackToIntro 
}: ResultScreenProps) => {
  const percentage = Math.round((score / totalPuzzles) * 100);
  
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Results: {score} out of {totalPuzzles}
      </h2>
      
      <div className="flex justify-center mb-8">
        {score === totalPuzzles ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {score / totalPuzzles >= 0.5 ? "🎉" : "🤔"}
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-lg font-medium mb-2">
          Accuracy: {percentage}%
        </p>
        <p className="text-muted-foreground">
          You scored {score} out of {totalPuzzles} possible points
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Category: {result.puzzle.category}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {result.puzzle.words.map((word, wordIndex) => {
                    const isCorrectAnswer = wordIndex === result.puzzle.correctWordIndex;
                    const wasSelected = wordIndex === result.selectedWordIndex;
                    
                    let className = "px-3 py-2 rounded text-sm border ";
                    
                    if (isCorrectAnswer) {
                      className += "bg-green-100 border-green-300 text-green-800";
                    } else if (wasSelected && !isCorrectAnswer) {
                      className += "bg-red-100 border-red-300 text-red-800";
                    } else {
                      className += "bg-gray-50 border-gray-200 text-gray-600";
                    }
                    
                    return (
                      <div key={wordIndex} className={className}>
                        {word}
                        {isCorrectAnswer && " ✓"}
                        {wasSelected && !isCorrectAnswer && " ✗"}
                      </div>
                    );
                  })}
                </div>
                {!result.isCorrect && (
                  <p className="text-sm text-muted-foreground mt-2">
                    You selected: {result.puzzle.words[result.selectedWordIndex]}
                  </p>
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
