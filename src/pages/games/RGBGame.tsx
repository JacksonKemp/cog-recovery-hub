
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Play, Check, X } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";
type ColorType = "red" | "green" | "blue";

interface ColorSquare {
  id: number;
  color: ColorType;
}

interface GameConfig {
  rounds: number;
  squaresPerRound: number;
  targetColorFrequency: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { rounds: 5, squaresPerRound: 4, targetColorFrequency: 3 },
  medium: { rounds: 8, squaresPerRound: 9, targetColorFrequency: 4 },
  hard: { rounds: 10, squaresPerRound: 16, targetColorFrequency: 5 },
};

const colorMap: Record<ColorType, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500"
};

const RGBGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [squares, setSquares] = useState<ColorSquare[]>([]);
  const [targetColor, setTargetColor] = useState<ColorType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [roundsCorrect, setRoundsCorrect] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate squares for a round
  const generateRound = () => {
    const colors: ColorType[] = ["red", "green", "blue"];
    const newTargetColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(newTargetColor);
    
    // Create array of squares with random colors
    const newSquares: ColorSquare[] = [];
    
    // Add target color squares
    for (let i = 0; i < gameConfig.targetColorFrequency; i++) {
      newSquares.push({
        id: i,
        color: newTargetColor
      });
    }
    
    // Fill remaining squares with other colors
    const otherColors = colors.filter(c => c !== newTargetColor);
    for (let i = gameConfig.targetColorFrequency; i < gameConfig.squaresPerRound; i++) {
      const randomColor = otherColors[Math.floor(Math.random() * otherColors.length)];
      newSquares.push({
        id: i,
        color: randomColor
      });
    }
    
    // Shuffle the squares
    const shuffledSquares = newSquares.sort(() => Math.random() - 0.5);
    setSquares(shuffledSquares);
  };
  
  // Start the game
  const startGame = () => {
    setCurrentRound(0);
    setScore(0);
    setRoundsCorrect(0);
    setGameState("playing");
    generateRound();
  };
  
  // Handle square click
  const handleSquareClick = (square: ColorSquare) => {
    const isCorrect = square.color === targetColor;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Move to next round or end game
    if (currentRound < gameConfig.rounds - 1) {
      setCurrentRound(currentRound + 1);
      generateRound();
      
      if (isCorrect) {
        setRoundsCorrect(roundsCorrect + 1);
      }
    } else {
      // Last round
      setGameState("result");
      if (isCorrect) {
        setRoundsCorrect(roundsCorrect + 1);
      }
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setCurrentRound(0);
    setScore(0);
    setRoundsCorrect(0);
    setSquares([]);
  };
  
  return (
    <GameLayout title="Red, Green, Blue Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Tap the squares in the target color when prompted.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Difficulty:</span>
              <Select value={difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={startGame} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Game
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "playing" && targetColor && (
        <div className="text-center">
          <h2 className="text-xl mb-2">
            Round {currentRound + 1} of {gameConfig.rounds}
          </h2>
          <p className="mb-6 text-lg font-medium">
            Find and tap all <span className="capitalize">{targetColor}</span> squares
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className={`grid grid-cols-${Math.sqrt(gameConfig.squaresPerRound)} gap-4`}>
                {squares.map((square) => (
                  <div
                    key={square.id}
                    className={`${colorMap[square.color]} w-16 h-16 rounded-lg cursor-pointer`}
                    onClick={() => handleSquareClick(square)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Button variant="outline" onClick={resetGame}>
            End Game
          </Button>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Results: {roundsCorrect} out of {gameConfig.rounds} rounds correct
          </h2>
          
          <div className="flex justify-center mb-8">
            {roundsCorrect === gameConfig.rounds ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <div className="text-4xl">
                {roundsCorrect / gameConfig.rounds >= 0.5 ? "🎉" : "🤔"}
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Back
            </Button>
            <Button onClick={startGame}>
              Play Again
            </Button>
          </div>
        </div>
      )}
    </GameLayout>
  );
};

export default RGBGame;
