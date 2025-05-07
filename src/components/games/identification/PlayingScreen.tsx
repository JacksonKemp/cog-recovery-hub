
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { IdentificationPuzzle } from "@/hooks/games/useIdentificationGame";

interface PlayingScreenProps {
  currentPuzzleIndex: number;
  puzzlesCount: number;
  currentPuzzle: IdentificationPuzzle;
  selectedIndices: number[];
  onToggleOption: (index: number) => void;
  onSubmitAnswer: () => void;
  onCancelGame: () => void;
}

const PlayingScreen = ({
  currentPuzzleIndex,
  puzzlesCount,
  currentPuzzle,
  selectedIndices,
  onToggleOption,
  onSubmitAnswer,
  onCancelGame
}: PlayingScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-2">
        Puzzle {currentPuzzleIndex + 1} of {puzzlesCount}
      </h2>
      <p className="mb-6 text-lg font-medium">
        {currentPuzzle.instruction}
      </p>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currentPuzzle.options.map((option, index) => (
              <Button 
                key={index}
                variant={selectedIndices.includes(index) ? "default" : "outline"}
                onClick={() => onToggleOption(index)}
                className="py-6 h-auto"
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancelGame}>
          Cancel
        </Button>
        <Button onClick={onSubmitAnswer}>
          {currentPuzzleIndex < puzzlesCount - 1 ? "Next" : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default PlayingScreen;
