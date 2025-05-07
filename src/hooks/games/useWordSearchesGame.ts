
import { useState } from "react";

export type Difficulty = "easy" | "medium" | "hard";
export type GameState = "intro" | "playing" | "result";

export interface WordSearch {
  grid: string[][];
  words: string[];
  foundWords: string[];
}

export interface GameConfig {
  gridSize: number;
  wordsCount: number;
}

// Sample words for the game
const wordPool = [
  "CAT", "DOG", "SUN", "SKY", "HAT", "RED",
  "BLUE", "TREE", "FISH", "BIRD", "MOON", "STAR",
  "BOOK", "DESK", "LAMP", "DOOR", "WALL", "CHAIR",
  "APPLE", "MUSIC", "WATER", "PAPER", "GREEN", "WHITE"
];

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { gridSize: 6, wordsCount: 3 },
  medium: { gridSize: 8, wordsCount: 5 },
  hard: { gridSize: 10, wordsCount: 7 },
};

export const useWordSearchesGame = () => {
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

  return {
    gameState,
    difficulty,
    wordSearch,
    selectedCells,
    gameConfig,
    handleDifficultyChange,
    startGame,
    handleCellClick,
    checkSelection,
    isGameComplete,
    calculateScore,
    endGame,
    resetGame
  };
};
