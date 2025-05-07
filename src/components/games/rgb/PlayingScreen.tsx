
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ColorSquare, colorMap } from "@/hooks/games/useRGBGame";

interface PlayingScreenProps {
  currentRound: number;
  totalRounds: number;
  targetColor: string;
  squares: ColorSquare[];
  squaresPerRound: number;
  onSquareClick: (square: ColorSquare) => void;
  onEndGame: () => void;
}

const PlayingScreen = ({ 
  currentRound, 
  totalRounds, 
  targetColor, 
  squares, 
  squaresPerRound,
  onSquareClick, 
  onEndGame 
}: PlayingScreenProps) => {
  // Determine grid columns based on square count (2x2, 3x3, or 4x4)
  const gridColumns = Math.sqrt(squaresPerRound);
  const gridClass = `grid grid-cols-${gridColumns} gap-4`;
  
  return (
    <div className="text-center">
      <h2 className="text-xl mb-2">
        Round {currentRound + 1} of {totalRounds}
      </h2>
      <p className="mb-6 text-lg font-medium">
        Find and tap all <span className="capitalize">{targetColor}</span> squares
      </p>
      
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className={gridClass}>
            {squares.map((square) => (
              <div
                key={square.id}
                className={`${colorMap[square.color]} w-16 h-16 rounded-lg cursor-pointer`}
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
