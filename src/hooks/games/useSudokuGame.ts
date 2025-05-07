
import { useState } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";

// 0 represents an empty cell
export type SudokuGrid = number[][];

interface GameConfig {
  emptyCells: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { emptyCells: 20 },
  medium: { emptyCells: 40 },
  hard: { emptyCells: 50 },
};

export const useSudokuGame = () => {
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
  
  return {
    gameState,
    difficulty,
    originalGrid,
    currentGrid,
    selectedCell,
    isValid,
    handleDifficultyChange,
    startGame,
    handleCellClick,
    handleNumberInput,
    checkSolution,
    resetPuzzle,
    resetGame
  };
};
