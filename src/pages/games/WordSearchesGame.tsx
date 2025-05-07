
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

interface WordSearch {
  grid: string[][];
  words: string[];
  foundWords: string[];
}

interface GameConfig {
  gridSize: number;
  wordsCount: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { gridSize: 6, wordsCount: 3 },
  medium: { gridSize: 8, wordsCount: 5 },
  hard: { gridSize: 10, wordsCount: 7 },
};

// Sample words for the game
const wordPool = [
  "CAT", "DOG", "SUN", "SKY", "HAT", "RED",
  "BLUE", "TREE", "FISH", "BIRD", "MOON", "STAR",
  "BOOK", "DESK", "LAMP", "DOOR", "WALL", "CHAIR",
  "APPLE", "MUSIC", "WATER", "PAPER", "GREEN", "WHITE"
];

const WordSearchesGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [wordSearch, setWordSearch] = useState<WordSearch>({
    grid: [],
    words: [],
    foundWords: []
  });
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Create a simple word search grid (a simplified implementation)
  const generateWordSearch = (size: number, numWords: number): WordSearch => {
    // Select random words from the pool
    const shuffledWords = [...wordPool].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledWords.slice(0, numWords).map(word => word.toUpperCase());
    
    // Create empty grid filled with placeholder dots
    const grid: string[][] = [];
    for (let i = 0; i < size; i++) {
      const row: string[] = [];
      for (let j = 0; j < size; j++) {
        row.push('.');
      }
      grid.push(row);
    }
    
    // In a real implementation, you would place the words in the grid
    // This is a simplified version where we don't actually place words
    // Just fill with random letters
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (grid[i][j] === '.') {
          grid[i][j] = letters[Math.floor(Math.random() * letters.length)];
        }
      }
    }
    
    return {
      grid,
      words: selectedWords,
      foundWords: []
    };
  };
  
  // Start the game
  const startGame = () => {
    const newWordSearch = generateWordSearch(gameConfig.gridSize, gameConfig.wordsCount);
    setWordSearch(newWordSearch);
    setSelectedCells([]);
    setGameState("playing");
  };
  
  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellId = `${rowIndex}-${colIndex}`;
    
    // Toggle selection
    if (selectedCells.includes(cellId)) {
      setSelectedCells(selectedCells.filter(id => id !== cellId));
    } else {
      setSelectedCells([...selectedCells, cellId]);
    }
  };
  
  // Check selected cells to see if they form a valid word
  const checkSelection = () => {
    if (selectedCells.length < 2) return;
    
    // Get letters from selected cells
    const letters = selectedCells.map(cellId => {
      const [rowIndex, colIndex] = cellId.split('-').map(Number);
      return wordSearch.grid[rowIndex][colIndex];
    });
    
    const selectedWord = letters.join('');
    
    // Check if it's one of the words to find
    if (wordSearch.words.includes(selectedWord) && !wordSearch.foundWords.includes(selectedWord)) {
      setWordSearch({
        ...wordSearch,
        foundWords: [...wordSearch.foundWords, selectedWord]
      });
    }
    
    setSelectedCells([]);
  };
  
  // Check if all words are found
  const isGameComplete = (): boolean => {
    return wordSearch.foundWords.length === wordSearch.words.length;
  };
  
  // Calculate score
  const calculateScore = (): number => {
    return wordSearch.foundWords.length;
  };
  
  // End the game
  const endGame = () => {
    setGameState("result");
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setWordSearch({
      grid: [],
      words: [],
      foundWords: []
    });
    setSelectedCells([]);
  };
  
  return (
    <GameLayout title="Word Searches Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Find words hidden in the letter grid.
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
      
      {gameState === "playing" && wordSearch.grid.length > 0 && (
        <div>
          <div className="flex flex-col md:flex-row md:justify-between mb-6">
            <div>
              <h2 className="text-xl mb-2">Find these words:</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {wordSearch.words.map((word) => (
                  <div 
                    key={word} 
                    className={`px-3 py-1 border rounded-full text-sm ${
                      wordSearch.foundWords.includes(word) 
                        ? "bg-green-100 border-green-500 text-green-700" 
                        : "bg-gray-100"
                    }`}
                  >
                    {word}
                    {wordSearch.foundWords.includes(word) && (
                      <Check className="inline-block ml-1 h-4 w-4" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Found {wordSearch.foundWords.length} of {wordSearch.words.length} words
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button onClick={checkSelection} disabled={selectedCells.length < 2} className="mb-2 w-full">
                Check Selection
              </Button>
              {isGameComplete() && (
                <Button onClick={endGame} className="w-full">
                  Finish Game
                </Button>
              )}
            </div>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-1" style={{ 
                gridTemplateColumns: `repeat(${wordSearch.grid.length}, minmax(0, 1fr))` 
              }}>
                {wordSearch.grid.map((row, rowIndex) => 
                  row.map((cell, colIndex) => {
                    const cellId = `${rowIndex}-${colIndex}`;
                    const isSelected = selectedCells.includes(cellId);
                    
                    return (
                      <button
                        key={cellId}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border font-medium rounded-md transition-colors ${
                          isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell}
                      </button>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={resetGame}>
              Cancel Game
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Results: {calculateScore()} out of {wordSearch.words.length} words found
          </h2>
          
          <div className="flex justify-center mb-8">
            {calculateScore() === wordSearch.words.length ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <div className="text-4xl">
                {calculateScore() / wordSearch.words.length >= 0.5 ? "🎉" : "🤔"}
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

export default WordSearchesGame;
