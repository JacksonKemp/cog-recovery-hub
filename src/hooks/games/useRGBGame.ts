
import { useState } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";
type ColorType = "red" | "green" | "blue";

export interface ColorSquare {
  id: number;
  color: ColorType;
}

interface GameConfig {
  rounds: number;
  squaresPerRound: number;
  targetColorFrequency: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { rounds: 5, squaresPerRound: 4, targetColorFrequency: 3 },
  medium: { rounds: 8, squaresPerRound: 9, targetColorFrequency: 4 },
  hard: { rounds: 10, squaresPerRound: 16, targetColorFrequency: 5 },
};

export const colorMap: Record<ColorType, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500"
};

export const useRGBGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [squares, setSquares] = useState<ColorSquare[]>([]);
  const [targetColor, setTargetColor] = useState<ColorType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [roundsCorrect, setRoundsCorrect] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate squares for a round
  const generateRound = () => {
    const colors: ColorType[] = ["red", "green", "blue"];
    const newTargetColor = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(newTargetColor);
    
    // Create array of squares with random colors
    const newSquares: ColorSquare[] = [];
    
    // Add target color squares
    for (let i = 0; i < gameConfig.targetColorFrequency; i++) {
      newSquares.push({
        id: i,
        color: newTargetColor
      });
    }
    
    // Fill remaining squares with other colors
    const otherColors = colors.filter(c => c !== newTargetColor);
    for (let i = gameConfig.targetColorFrequency; i < gameConfig.squaresPerRound; i++) {
      const randomColor = otherColors[Math.floor(Math.random() * otherColors.length)];
      newSquares.push({
        id: i,
        color: randomColor
      });
    }
    
    // Shuffle the squares
    const shuffledSquares = newSquares.sort(() => Math.random() - 0.5);
    setSquares(shuffledSquares);
  };
  
  // Start the game
  const startGame = () => {
    setCurrentRound(0);
    setScore(0);
    setRoundsCorrect(0);
    setGameState("playing");
    generateRound();
  };
  
  // Handle square click
  const handleSquareClick = (square: ColorSquare) => {
    const isCorrect = square.color === targetColor;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Move to next round or end game
    if (currentRound < gameConfig.rounds - 1) {
      setCurrentRound(currentRound + 1);
      generateRound();
      
      if (isCorrect) {
        setRoundsCorrect(roundsCorrect + 1);
      }
    } else {
      // Last round
      setGameState("result");
      if (isCorrect) {
        setRoundsCorrect(roundsCorrect + 1);
      }
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setCurrentRound(0);
    setScore(0);
    setRoundsCorrect(0);
    setSquares([]);
  };
  
  return {
    gameState,
    difficulty,
    currentRound,
    squares,
    targetColor,
    score,
    roundsCorrect,
    gameConfig,
    handleDifficultyChange,
    startGame,
    handleSquareClick,
    resetGame
  };
};
