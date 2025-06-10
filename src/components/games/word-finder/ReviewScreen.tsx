
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { PuzzleResult } from "@/hooks/games/useWordFinderGame";

interface ReviewScreenProps {
  puzzleResults: PuzzleResult[];
  onContinue: () => void;
}

const ReviewScreen = ({ puzzleResults, onContinue }: ReviewScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Review Your Answers
      </h2>
      
      <div className="space-y-4 mb-8 max-h-96 overflow-y-auto">
        {puzzleResults.map((result, index) => (
          <Card key={index} className="text-left">
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
      
      <Button onClick={onContinue} size="lg">
        View Results
      </Button>
    </div>
  );
};

export default ReviewScreen;
