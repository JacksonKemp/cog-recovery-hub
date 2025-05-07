
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
import { Play, Check, X, RotateCcw } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";

// 0 represents an empty cell
type SudokuGrid = number[][];

interface GameConfig {
  emptyCells: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { emptyCells: 20 },
  medium: { emptyCells: 40 },
  hard: { emptyCells: 50 },
};

const SudokuGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [originalGrid, setOriginalGrid] = useState<SudokuGrid>([]);
  const [currentGrid, setCurrentGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate a simple sudoku puzzle
  // This is a placeholder - in a real game, you would have proper puzzle generation
  const generateSudokuGrid = (): SudokuGrid => {
    const size = 9;
    const grid: SudokuGrid = [];
    
    // Create a solved grid (very simplified version)
    for (let i = 0; i < size; i++) {
      const row: number[] = [];
      for (let j = 0; j < size; j++) {
        // This isn't a valid sudoku, just a placeholder for UI
        row.push((i * 3 + Math.floor(i / 3) + j) % 9 + 1);
      }
      grid.push(row);
    }
    
    return grid;
  };
  
  // Create the puzzle by removing cells
  const createPuzzle = (solvedGrid: SudokuGrid, emptyCells: number): SudokuGrid => {
    const puzzle = solvedGrid.map(row => [...row]);
    const positions: [number, number][] = [];
    
    // Create a list of all positions
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        positions.push([i, j]);
      }
    }
    
    // Shuffle positions
    positions.sort(() => Math.random() - 0.5);
    
    // Remove values from cells
    for (let i = 0; i < emptyCells && i < positions.length; i++) {
      const [row, col] = positions[i];
      puzzle[row][col] = 0;
    }
    
    return puzzle;
  };
  
  // Start the game
  const startGame = () => {
    const solvedGrid = generateSudokuGrid();
    const puzzleGrid = createPuzzle(solvedGrid, gameConfig.emptyCells);
    
    setOriginalGrid(puzzleGrid.map(row => [...row]));
    setCurrentGrid(puzzleGrid.map(row => [...row]));
    setSelectedCell(null);
    setIsValid(true);
    setGameState("playing");
  };
  
  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Don't allow selecting original cells
    if (originalGrid[rowIndex][colIndex] !== 0) return;
    
    setSelectedCell([rowIndex, colIndex]);
  };
  
  // Handle number input
  const handleNumberInput = (number: number) => {
    if (!selectedCell) return;
    
    const [rowIndex, colIndex] = selectedCell;
    const newGrid = currentGrid.map(row => [...row]);
    
    // Allow clearing a cell with 0
    newGrid[rowIndex][colIndex] = number;
    
    setCurrentGrid(newGrid);
    setIsValid(validateGrid(newGrid));
  };
  
  // Simple validation for the current grid state
  const validateGrid = (grid: SudokuGrid): boolean => {
    // This is a simplified validation
    // In a real game, you would check rows, columns, and boxes
    
    // Check for empty cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  // Check if the puzzle is solved correctly
  const checkSolution = () => {
    setGameState("result");
  };
  
  // Reset to original puzzle
  const resetPuzzle = () => {
    setCurrentGrid(originalGrid.map(row => [...row]));
    setSelectedCell(null);
    setIsValid(false);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setOriginalGrid([]);
    setCurrentGrid([]);
    setSelectedCell(null);
    setIsValid(true);
  };
  
  // Render number input buttons
  const renderNumberButtons = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {numbers.map(number => (
          <Button 
            key={number}
            onClick={() => handleNumberInput(number)}
            disabled={!selectedCell}
            variant="outline"
            className="w-10 h-10"
          >
            {number}
          </Button>
        ))}
        <Button 
          onClick={() => handleNumberInput(0)}
          disabled={!selectedCell}
          variant="outline"
          className="w-10 h-10"
        >
          Clear
        </Button>
      </div>
    );
  };
  
  return (
    <GameLayout title="Sudoku Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Fill the grid with numbers 1-9.
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
      
      {gameState === "playing" && currentGrid.length > 0 && (
        <div className="text-center">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-9 gap-[1px] bg-gray-300 border border-gray-400">
                {currentGrid.map((row, rowIndex) => 
                  row.map((cell, colIndex) => {
                    const isOriginal = originalGrid[rowIndex][colIndex] !== 0;
                    const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
                    const isSameBox = 
                      selectedCell && 
                      Math.floor(rowIndex / 3) === Math.floor(selectedCell[0] / 3) &&
                      Math.floor(colIndex / 3) === Math.floor(selectedCell[1] / 3);
                    
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-medium
                          ${isOriginal ? "bg-gray-100" : "bg-white hover:bg-gray-50 cursor-pointer"}
                          ${isSelected ? "bg-primary text-primary-foreground" : ""}
                          ${isSameBox && !isSelected ? "bg-gray-50" : ""}
                          ${(rowIndex + 1) % 3 === 0 && rowIndex < 8 ? "border-b border-gray-500" : ""}
                          ${(colIndex + 1) % 3 === 0 && colIndex < 8 ? "border-r border-gray-500" : ""}
                        `}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell !== 0 ? cell : ""}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
          
          {renderNumberButtons()}
          
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" onClick={resetPuzzle} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={checkSolution} disabled={!isValid}>
              Check Solution
            </Button>
            <Button variant="outline" onClick={resetGame}>
              Quit
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            {isValid ? "Puzzle Solved!" : "Not Quite Right"}
          </h2>
          
          <div className="flex justify-center mb-8">
            {isValid ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <X className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Back
            </Button>
            <Button onClick={startGame}>
              New Game
            </Button>
          </div>
        </div>
      )}
    </GameLayout>
  );
};

export default SudokuGame;
