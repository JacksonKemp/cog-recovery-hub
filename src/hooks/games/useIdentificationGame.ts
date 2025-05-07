
import { useState } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";
export type ColorType = "red" | "green" | "blue";

export interface IdentificationPuzzle {
  id: number;
  instruction: string;
  options: string[];
  correctIndices: number[];
}

interface GameConfig {
  puzzles: number;
  squaresPerRound: number;
  targetColorFrequency: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { puzzles: 5, squaresPerRound: 4, targetColorFrequency: 3 },
  medium: { puzzles: 8, squaresPerRound: 9, targetColorFrequency: 4 },
  hard: { puzzles: 10, squaresPerRound: 16, targetColorFrequency: 5 },
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

export const useIdentificationGame = () => {
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
  
  return {
    gameState,
    difficulty,
    puzzles,
    currentPuzzleIndex,
    selectedIndices,
    score,
    gameConfig,
    handleDifficultyChange,
    startGame,
    toggleOption,
    submitAnswer,
    resetGame
  };
};
