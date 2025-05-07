
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

interface IdentificationPuzzle {
  id: number;
  instruction: string;
  options: string[];
  correctIndices: number[];
}

interface GameConfig {
  puzzles: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { puzzles: 5 },
  medium: { puzzles: 8 },
  hard: { puzzles: 12 },
};

// Sample puzzles
const puzzleTemplates = [
  {
    instruction: "Select all fruits",
    positiveOptions: ["Apple", "Banana", "Orange", "Grape", "Kiwi", "Peach", "Mango"],
    negativeOptions: ["Carrot", "Potato", "Broccoli", "Onion", "Tomato", "Cucumber", "Lettuce"]
  },
  {
    instruction: "Select all animals",
    positiveOptions: ["Dog", "Cat", "Elephant", "Tiger", "Dolphin", "Eagle", "Zebra"],
    negativeOptions: ["Table", "Chair", "Laptop", "Car", "Bicycle", "Phone", "Book"]
  },
  {
    instruction: "Select all colors",
    positiveOptions: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink"],
    negativeOptions: ["Apple", "Sky", "Grass", "Sun", "Grape", "Carrot", "Flower"]
  },
  {
    instruction: "Select all vehicles",
    positiveOptions: ["Car", "Bus", "Train", "Airplane", "Bicycle", "Boat", "Motorcycle"],
    negativeOptions: ["House", "Tree", "Phone", "Chair", "Book", "Shoe", "Hat"]
  },
  {
    instruction: "Select all clothing items",
    positiveOptions: ["Shirt", "Pants", "Dress", "Jacket", "Hat", "Socks", "Shoes"],
    negativeOptions: ["Table", "Dog", "Apple", "Car", "Book", "Computer", "Plate"]
  }
];

const IdentificationGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [puzzles, setPuzzles] = useState<IdentificationPuzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate puzzles based on difficulty
  const generatePuzzles = (count: number): IdentificationPuzzle[] => {
    const generatedPuzzles: IdentificationPuzzle[] = [];
    const shuffledTemplates = [...puzzleTemplates].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < count; i++) {
      const templateIndex = i % shuffledTemplates.length;
      const template = shuffledTemplates[templateIndex];
      
      // Determine number of correct options based on difficulty
      const numCorrect = difficulty === "easy" ? 3 : (difficulty === "medium" ? 4 : 5);
      
      // Shuffle positive options and take some
      const shuffledPositive = [...template.positiveOptions].sort(() => Math.random() - 0.5);
      const selectedPositive = shuffledPositive.slice(0, numCorrect);
      
      // Shuffle negative options and take the rest
      const shuffledNegative = [...template.negativeOptions].sort(() => Math.random() - 0.5);
      const selectedNegative = shuffledNegative.slice(0, 8 - numCorrect);
      
      // Combine and shuffle all options
      const allOptions = [...selectedPositive, ...selectedNegative].sort(() => Math.random() - 0.5);
      
      // Find indices of correct answers
      const correctIndices = allOptions.map((option, index) => 
        selectedPositive.includes(option) ? index : -1
      ).filter(index => index !== -1);
      
      generatedPuzzles.push({
        id: i,
        instruction: template.instruction,
        options: allOptions,
        correctIndices
      });
    }
    
    return generatedPuzzles;
  };
  
  // Start the game
  const startGame = () => {
    const newPuzzles = generatePuzzles(gameConfig.puzzles);
    setPuzzles(newPuzzles);
    setCurrentPuzzleIndex(0);
    setSelectedIndices([]);
    setScore(0);
    setGameState("playing");
  };
  
  // Toggle option selection
  const toggleOption = (index: number) => {
    setSelectedIndices(prevIndices => {
      if (prevIndices.includes(index)) {
        return prevIndices.filter(i => i !== index);
      } else {
        return [...prevIndices, index];
      }
    });
  };
  
  // Submit answer and move to next puzzle
  const submitAnswer = () => {
    const currentPuzzle = puzzles[currentPuzzleIndex];
    const correctIndices = currentPuzzle.correctIndices;
    
    // Calculate score based on correct and incorrect selections
    let puzzleScore = 0;
    const maxScore = correctIndices.length;
    
    // Count correct selections
    correctIndices.forEach(index => {
      if (selectedIndices.includes(index)) {
        puzzleScore++;
      }
    });
    
    // Penalize incorrect selections
    selectedIndices.forEach(index => {
      if (!correctIndices.includes(index)) {
        puzzleScore = Math.max(0, puzzleScore - 0.5);
      }
    });
    
    // Add to total score
    setScore(score + puzzleScore);
    
    // Move to next puzzle or end game
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      setSelectedIndices([]);
    } else {
      setGameState("result");
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setPuzzles([]);
    setCurrentPuzzleIndex(0);
    setSelectedIndices([]);
    setScore(0);
  };
  
  return (
    <GameLayout title="Identification Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Select objects based on instructions.
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
      
      {gameState === "playing" && puzzles.length > 0 && (
        <div className="text-center">
          <h2 className="text-xl mb-2">
            Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
          </h2>
          <p className="mb-6 text-lg font-medium">
            {puzzles[currentPuzzleIndex].instruction}
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {puzzles[currentPuzzleIndex].options.map((option, index) => (
                  <Button 
                    key={index}
                    variant={selectedIndices.includes(index) ? "default" : "outline"}
                    onClick={() => toggleOption(index)}
                    className="py-6 h-auto"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Cancel
            </Button>
            <Button onClick={submitAnswer}>
              {currentPuzzleIndex < puzzles.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Results: {Math.round(score)} points
          </h2>
          
          <div className="flex justify-center mb-8">
            {score / puzzles.length >= puzzles.length * 0.75 ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <div className="text-4xl">
                {score / puzzles.length >= 0.5 ? "🎉" : "🤔"}
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

export default IdentificationGame;
