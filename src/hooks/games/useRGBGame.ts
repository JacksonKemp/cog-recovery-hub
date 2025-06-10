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
  const colorCycleRef = useRef<NodeJS.Timeout | null>(null);

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
  
  // Generate new target color and cycle
  const startColorCycle = () => {
    const colors: ColorType[] = ["red", "green", "blue"];
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    
    console.log("Starting new color cycle with:", newColor);
    setCurrentTargetColor(newColor);
    setShowColorPrompt(true);
    
    // Schedule the next color cycle
    if (colorCycleRef.current) {
      clearTimeout(colorCycleRef.current);
    }
    
    colorCycleRef.current = setTimeout(() => {
      console.log("Color cycle timeout, starting next color immediately");
      // Check if game is still running before starting next cycle
      setTimeLeft(currentTime => {
        if (currentTime > 0) {
          console.log("Game still running, starting next color cycle");
          startColorCycle();
        }
        return currentTime;
      });
    }, gameConfig.reactionTime);
  };
  
  // Start the game
  const startGame = () => {
    console.log("Starting RGB game");
    setScore(0);
    setTimeLeft(gameConfig.gameDuration);
    setGameState("playing");
    setShowColorPrompt(false);
    setCurrentTargetColor(null);
    
    // Clear any existing timers
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (colorCycleRef.current) {
      clearTimeout(colorCycleRef.current);
    }
    
    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        console.log("Game timer tick, time left:", prev - 1);
        if (prev <= 1) {
          console.log("Game ending");
          setGameState("result");
          setShowColorPrompt(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start first color cycle after brief delay
    setTimeout(() => {
      console.log("Starting first color cycle");
      startColorCycle();
    }, 1000);
  };
  
  // Handle square click
  const handleSquareClick = (square: ColorSquare) => {
    console.log("Square clicked:", square.color, "Target:", currentTargetColor, "Show prompt:", showColorPrompt);
    
    if (!showColorPrompt || !currentTargetColor) {
      console.log("Click ignored - no active prompt");
      return;
    }
    
    const isCorrect = square.color === currentTargetColor;
    console.log("Click result:", isCorrect ? "correct" : "incorrect");
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    // Clear current color cycle and start new one immediately
    if (colorCycleRef.current) {
      clearTimeout(colorCycleRef.current);
    }
    
    // Start next color immediately
    setTimeLeft(currentTime => {
      if (currentTime > 0) {
        console.log("Starting next color after click");
        startColorCycle();
      }
      return currentTime;
    });
  };
  
  // Reset the game
  const resetGame = () => {
    console.log("Resetting game");
    setGameState("intro");
    setScore(0);
    setTimeLeft(0);
    setCurrentTargetColor(null);
    setShowColorPrompt(false);
    
    // Clear all timers
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    if (colorCycleRef.current) {
      clearTimeout(colorCycleRef.current);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (colorCycleRef.current) {
        clearTimeout(colorCycleRef.current);
      }
    };
  }, []);

  // Clean up timers when game ends
  useEffect(() => {
    if (gameState === "result") {
      console.log("Game ended, cleaning up timers");
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (colorCycleRef.current) {
        clearTimeout(colorCycleRef.current);
      }
    }
  }, [gameState]);
  
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
