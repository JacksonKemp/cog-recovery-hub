import { useState } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";

export interface WordPuzzle {
  id: number;
  correctWordIndex: number;
  words: string[];
  category: string;
}

export interface PuzzleResult {
  puzzle: WordPuzzle;
  selectedWordIndex: number;
  isCorrect: boolean;
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

export const useWordFinderGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [puzzles, setPuzzles] = useState<WordPuzzle[]>([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  const [puzzleResults, setPuzzleResults] = useState<PuzzleResult[]>([]);
  
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
    setPuzzleResults([]);
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
    const isCorrect = selectedWordIndex === currentPuzzle.correctWordIndex;
    
    // Record the result
    const result: PuzzleResult = {
      puzzle: currentPuzzle,
      selectedWordIndex,
      isCorrect
    };
    
    setPuzzleResults(prev => [...prev, result]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Move to next puzzle or show results
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
      setSelectedWordIndex(null);
    } else {
      setGameState("result");
    }
  };
  
  // Move from review to results (kept for compatibility but not used)
  const showResults = () => {
    setGameState("result");
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setPuzzles([]);
    setCurrentPuzzleIndex(0);
    setSelectedWordIndex(null);
    setScore(0);
    setPuzzleResults([]);
  };

  return {
    gameState,
    difficulty,
    puzzles,
    currentPuzzleIndex,
    selectedWordIndex,
    score,
    gameConfig,
    puzzleResults,
    handleDifficultyChange,
    startGame,
    handleWordSelect,
    submitAnswer,
    showResults,
    resetGame
  };
};
