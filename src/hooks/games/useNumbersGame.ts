
import { useState, useEffect } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "memorize" | "wait" | "recall" | "result";

interface GameConfig {
  digits: number;
  memorizeTime: number;
  waitTime: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { digits: 5, memorizeTime: 10, waitTime: 15 },
  medium: { digits: 7, memorizeTime: 7, waitTime: 15 },
  hard: { digits: 9, memorizeTime: 5, waitTime: 15 },
};

export const useNumbersGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [numbers, setNumbers] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Generate random numbers based on difficulty
  const generateNumbers = (digits: number): string => {
    let result = "";
    for (let i = 0; i < digits; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Start the game
  const startGame = () => {
    const newNumbers = generateNumbers(gameConfig.digits);
    setNumbers(newNumbers);
    setTimeLeft(gameConfig.memorizeTime);
    setGameState("memorize");
    setUserInput("");
    setIsCorrect(null);
    setScore(0);
  };

  // Calculate score based on correct digits
  const calculateScore = (): number => {
    const correctDigits = numbers.split('').filter((digit, index) => {
      return userInput[index] === digit;
    }).length;
    
    const totalDigits = numbers.length;
    const scorePercentage = Math.round((correctDigits / totalDigits) * 100);
    
    return scorePercentage;
  };

  // Check the answer
  const checkAnswer = () => {
    const correct = userInput === numbers;
    const calculatedScore = calculateScore();
    
    setIsCorrect(correct);
    setScore(calculatedScore);
    setGameState("result");
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setNumbers("");
    setUserInput("");
    setIsCorrect(null);
    setScore(0);
  };

  // Handle user input change
  const handleUserInputChange = (value: string) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setUserInput(value);
    }
  };
  
  // Timer effect
  useEffect(() => {
    if ((gameState === "memorize" || gameState === "wait") && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      if (gameState === "memorize") {
        setGameState("wait");
        setTimeLeft(gameConfig.waitTime);
      } else if (gameState === "wait") {
        setGameState("recall");
      }
    }
  }, [timeLeft, gameState, gameConfig.waitTime]);
  
  return {
    gameState,
    difficulty,
    numbers,
    userInput,
    isCorrect,
    score,
    handleDifficultyChange,
    startGame,
    checkAnswer,
    resetGame,
    handleUserInputChange
  };
};
