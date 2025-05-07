
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { WordPuzzle } from "@/hooks/games/useWordFinderGame";

interface PlayingScreenProps {
  currentPuzzleIndex: number;
  puzzleCount: number;
  currentPuzzle: WordPuzzle;
  selectedWordIndex: number | null;
  onWordSelect: (index: number) => void;
  onSubmitAnswer: () => void;
  onCancel: () => void;
}

const PlayingScreen = ({ 
  currentPuzzleIndex, 
  puzzleCount, 
  currentPuzzle,
  selectedWordIndex,
  onWordSelect,
  onSubmitAnswer,
  onCancel
}: PlayingScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-2">
        Puzzle {currentPuzzleIndex + 1} of {puzzleCount}
      </h2>
      <p className="mb-6 text-lg font-medium">
        Find the word that doesn't belong with the others
      </p>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currentPuzzle.words.map((word, index) => (
              <Button 
                key={index}
                variant={selectedWordIndex === index ? "default" : "outline"}
                onClick={() => onWordSelect(index)}
                className="py-6 text-lg"
              >
                {word}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmitAnswer}
          disabled={selectedWordIndex === null}
        >
          {currentPuzzleIndex < puzzleCount - 1 ? "Next" : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default PlayingScreen;
