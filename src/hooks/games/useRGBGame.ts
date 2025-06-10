
import { useState, useEffect, useRef } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";
type ColorType = "red" | "green" | "blue";

export interface ColorSquare {
  id: number;
  color: ColorType;
}

interface GameConfig {
  gameDuration: number; // in seconds
  reactionTime: number; // in milliseconds
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { gameDuration: 60, reactionTime: 1000 }, // 1 second to react
  medium: { gameDuration: 60, reactionTime: 750 }, // 0.75 seconds to react
  hard: { gameDuration: 60, reactionTime: 500 }, // 0.5 seconds to react
};

export const colorMap: Record<ColorType, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500"
};

export const useRGBGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentTargetColor, setCurrentTargetColor] = useState<ColorType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  const [showColorPrompt, setShowColorPrompt] = useState<boolean>(false);
  
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const colorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Fixed squares - always the same three colors
  const squares: ColorSquare[] = [
    { id: 1, color: "red" },
    { id: 2, color: "green" },
    { id: 3, color: "blue" }
  ];
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate new target color
  const generateNewTargetColor = () => {
    const colors: ColorType[] = ["red", "green", "blue"];
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setCurrentTargetColor(newColor);
    setShowColorPrompt(true);
    
    // Hide the prompt after reaction time expires
    if (colorTimerRef.current) {
      clearTimeout(colorTimerRef.current);
    }
    
    colorTimerRef.current = setTimeout(() => {
      setShowColorPrompt(false);
      // Generate next color after a brief pause
      setTimeout(() => {
        if (timeLeft > 0) {
          generateNewTargetColor();
        }
      }, 200);
    }, gameConfig.reactionTime);
  };
  
  // Start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(gameConfig.gameDuration);
    setGameState("playing");
    
    // Start game timer
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("result");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start with first color after a brief delay
    setTimeout(() => {
      generateNewTargetColor();
    }, 1000);
  };
  
  // Handle square click
  const handleSquareClick = (square: ColorSquare) => {
    if (!showColorPrompt || !currentTargetColor) return;
    
    const isCorrect = square.color === currentTargetColor;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Hide current prompt and generate new color
    setShowColorPrompt(false);
    if (colorTimerRef.current) {
      clearTimeout(colorTimerRef.current);
    }
    
    // Generate next color after a brief pause
    setTimeout(() => {
      if (timeLeft > 0) {
        generateNewTargetColor();
      }
    }, 300);
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setScore(0);
    setTimeLeft(0);
    setCurrentTargetColor(null);
    setShowColorPrompt(false);
    
    // Clear all timers
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (colorTimerRef.current) {
      clearTimeout(colorTimerRef.current);
    }
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (colorTimerRef.current) {
        clearTimeout(colorTimerRef.current);
      }
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, []);
  
  return {
    gameState,
    difficulty,
    squares,
    currentTargetColor,
    showColorPrompt,
    score,
    timeLeft,
    gameConfig,
    handleDifficultyChange,
    startGame,
    handleSquareClick,
    resetGame
  };
};
