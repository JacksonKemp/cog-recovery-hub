
import { useState, useEffect } from "react";
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
import { Play, Timer, Check, X } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "memorize" | "wait" | "recall" | "result";

interface GameConfig {
  digits: number;
  memorizeTime: number;
  waitTime: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { digits: 5, memorizeTime: 10, waitTime: 15 },
  medium: { digits: 7, memorizeTime: 7, waitTime: 15 },
  hard: { digits: 9, memorizeTime: 5, waitTime: 15 },
};

const NumbersGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [numbers, setNumbers] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Generate random numbers based on difficulty
  const generateNumbers = (digits: number): string => {
    let result = "";
    for (let i = 0; i < digits; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Start the game
  const startGame = () => {
    const newNumbers = generateNumbers(gameConfig.digits);
    setNumbers(newNumbers);
    setTimeLeft(gameConfig.memorizeTime);
    setGameState("memorize");
    setUserInput("");
    setIsCorrect(null);
  };
  
  // Timer effect
  useEffect(() => {
    if ((gameState === "memorize" || gameState === "wait") && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      if (gameState === "memorize") {
        setGameState("wait");
        setTimeLeft(gameConfig.waitTime);
      } else if (gameState === "wait") {
        setGameState("recall");
      }
    }
  }, [timeLeft, gameState, gameConfig.waitTime]);
  
  // Check the answer
  const checkAnswer = () => {
    const correct = userInput === numbers;
    setIsCorrect(correct);
    setGameState("result");
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setNumbers("");
    setUserInput("");
    setIsCorrect(null);
  };
  
  return (
    <GameLayout title="Numbers Memory Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            You will be shown a sequence of numbers for a short time. Memorize them, 
            wait for a time period, and then enter them back in the correct order.
          </p>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Difficulty Levels</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>Easy: 5 digits, 10 seconds to memorize</li>
              <li>Medium: 7 digits, 7 seconds to memorize</li>
              <li>Hard: 9 digits, 5 seconds to memorize</li>
            </ul>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Select difficulty:</span>
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
      
      {gameState === "memorize" && (
        <div className="text-center">
          <h2 className="text-xl mb-2">Memorize these numbers</h2>
          <p className="text-muted-foreground mb-6">Time left: {timeLeft} seconds</p>
          
          <Card className="mb-6">
            <CardContent className="p-10">
              <div className="text-4xl font-bold tracking-wider">{numbers}</div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <Timer className="h-6 w-6 animate-pulse text-primary" />
          </div>
        </div>
      )}
      
      {gameState === "wait" && (
        <div className="text-center">
          <h2 className="text-xl mb-6">Wait for {timeLeft} seconds...</h2>
          <p className="text-4xl mb-8">🧠</p>
          <p className="text-muted-foreground">Try to keep the number sequence in your memory</p>
        </div>
      )}
      
      {gameState === "recall" && (
        <div className="text-center">
          <h2 className="text-xl mb-6">Enter the numbers you memorized</h2>
          
          <div className="mb-8">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full max-w-xs p-4 text-center text-2xl border rounded-md"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Cancel
            </Button>
            <Button 
              onClick={checkAnswer} 
              disabled={!userInput.length}
            >
              Check Answer
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            {isCorrect ? "Correct! 🎉" : "Not quite right 🤔"}
          </h2>
          
          <div className="flex justify-center mb-8">
            {isCorrect ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <X className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          <div className="mb-8">
            <p className="mb-2">The correct sequence was:</p>
            <div className="text-2xl font-bold">{numbers}</div>
            {!isCorrect && (
              <p className="mt-4">Your answer: <span className="font-medium">{userInput}</span></p>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setGameState("intro")}>
              Back to Instructions
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

export default NumbersGame;
