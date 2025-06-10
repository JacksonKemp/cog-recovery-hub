
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorSquare, colorMap } from "@/hooks/games/useRGBGame";

interface PlayingScreenProps {
  squares: ColorSquare[];
  currentTargetColor: string | null;
  showColorPrompt: boolean;
  score: number;
  timeLeft: number;
  onSquareClick: (square: ColorSquare) => void;
  onEndGame: () => void;
}

const PlayingScreen = ({ 
  squares,
  currentTargetColor,
  showColorPrompt,
  score,
  timeLeft,
  onSquareClick, 
  onEndGame 
}: PlayingScreenProps) => {
  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-medium">
          Score: {score}
        </div>
        <div className="text-lg font-medium">
          Time: {timeLeft}s
        </div>
      </div>
      
      <div className="mb-8">
        {showColorPrompt && currentTargetColor ? (
          <p className="text-2xl font-bold mb-4">
            Tap <span className="capitalize text-3xl">{currentTargetColor}</span>!
          </p>
        ) : (
          <p className="text-2xl font-bold mb-4 text-muted-foreground">
            Get ready...
          </p>
        )}
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex justify-center gap-8">
            {squares.map((square) => (
              <div
                key={square.id}
                className={`${colorMap[square.color]} w-24 h-24 rounded-lg cursor-pointer transition-transform hover:scale-105 active:scale-95`}
                onClick={() => onSquareClick(square)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Button variant="outline" onClick={onEndGame}>
        End Game
      </Button>
    </div>
  );
};

export default PlayingScreen;
