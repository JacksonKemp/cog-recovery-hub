
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

interface WordPuzzle {
  id: number;
  correctWordIndex: number;
  words: string[];
  category: string;
}

interface GameConfig {
  puzzles: number;
  wordsPerPuzzle: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { puzzles: 5, wordsPerPuzzle: 4 },
  medium: { puzzles: 8, wordsPerPuzzle: 6 },
  hard: { puzzles: 10, wordsPerPuzzle: 8 },
};

// Sample word groups by category
const wordGroups = [
  {
    category: "Animals",
    similar: ["dog", "cat", "bird", "horse", "rabbit", "hamster", "mouse", "fish"],
    different: ["apple", "chair", "book", "car", "computer", "pizza", "pen", "hat"]
  },
  {
    category: "Colors",
    similar: ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"],
    different: ["table", "phone", "window", "door", "tree", "water", "shoe", "cup"]
  },
  {
    category: "Fruits",
    similar: ["apple", "banana", "orange", "grape", "kiwi", "peach", "cherry", "strawberry"],
    different: ["carrot", "potato", "dog", "chair", "book", "house", "car", "pen"]
  },
  {
    category: "Vehicles",
    similar: ["car", "truck", "bus", "train", "plane", "boat", "motorcycle", "bicycle"],
    different: ["apple", "table", "chair", "dog", "flower", "book", "pencil", "shoe"]
  },
];

const WordFinderGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [puzzles, setPuzzles] = useState<WordPuzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate puzzles based on difficulty
  const generatePuzzles = (count: number, wordsPerPuzzle: number): WordPuzzle[] => {
    const generatedPuzzles: WordPuzzle[] = [];
    
    // Use a random selection of categories
    const shuffledGroups = [...wordGroups].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < count; i++) {
      // Choose a category from our word groups
      const groupIndex = i % shuffledGroups.length;
      const group = shuffledGroups[groupIndex];
      
      // Create words array
      let words: string[] = [];
      let correctWordIndex: number;
      
      // Decide if the different word will be from the similar category or the different word will be among similar ones
      const differentIsAmongSimilar = Math.random() > 0.5;
      
      if (differentIsAmongSimilar) {
        // Pick (wordsPerPuzzle - 1) similar words
        words = [...group.similar]
          .sort(() => Math.random() - 0.5)
          .slice(0, wordsPerPuzzle - 1);
        
        // Add 1 different word
        const differentWord = group.different[Math.floor(Math.random() * group.different.length)];
        correctWordIndex = Math.floor(Math.random() * wordsPerPuzzle);
        words.splice(correctWordIndex, 0, differentWord);
      } else {
        // Pick all similar words
        words = [...group.similar]
          .sort(() => Math.random() - 0.5)
          .slice(0, wordsPerPuzzle);
        
        // Replace 1 with a different word
        correctWordIndex = Math.floor(Math.random() * wordsPerPuzzle);
        const differentWord = group.different[Math.floor(Math.random() * group.different.length)];
        words[correctWordIndex] = differentWord;
      }
      
      generatedPuzzles.push({
        id: i,
        correctWordIndex,
        words,
        category: group.category
      });
    }
    
    return generatedPuzzles;
  };
  
  // Start the game
  const startGame = () => {
    const newPuzzles = generatePuzzles(gameConfig.puzzles, gameConfig.wordsPerPuzzle);
    setPuzzles(newPuzzles);
    setCurrentPuzzleIndex(0);
    setSelectedWordIndex(null);
    setScore(0);
    setGameState("playing");
  };
  
  // Handle word selection
  const handleWordSelect = (index: number) => {
    setSelectedWordIndex(index);
  };
  
  // Submit answer and move to next puzzle
  const submitAnswer = () => {
    if (selectedWordIndex === null) return;
    
    const currentPuzzle = puzzles[currentPuzzleIndex];
    if (selectedWordIndex === currentPuzzle.correctWordIndex) {
      setScore(score + 1);
    }
    
    // Move to next puzzle or end game
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      setSelectedWordIndex(null);
    } else {
      setGameState("result");
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setPuzzles([]);
    setCurrentPuzzleIndex(0);
    setSelectedWordIndex(null);
    setScore(0);
  };
  
  return (
    <GameLayout title="Word Finder Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Find the different word in each group.
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
            Find the word that doesn't belong with the others
          </p>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {puzzles[currentPuzzleIndex].words.map((word, index) => (
                  <Button 
                    key={index}
                    variant={selectedWordIndex === index ? "default" : "outline"}
                    onClick={() => handleWordSelect(index)}
                    className="py-6 text-lg"
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Cancel
            </Button>
            <Button 
              onClick={submitAnswer}
              disabled={selectedWordIndex === null}
            >
              {currentPuzzleIndex < puzzles.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Results: {score} out of {puzzles.length}
          </h2>
          
          <div className="flex justify-center mb-8">
            {score === puzzles.length ? (
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

export default WordFinderGame;
