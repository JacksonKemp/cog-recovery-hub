
import { useState, useEffect } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "instruction" | "wait" | "recall" | "result";

interface GameResult {
  originalInstruction: string;
  userResponse: string;
  accuracyScore: number;
  feedback: string;
}

interface GameConfig {
  rounds: number;
  instructionTime: number;
  waitTime: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { rounds: 3, instructionTime: 15, waitTime: 10 },
  medium: { rounds: 5, instructionTime: 12, waitTime: 10 },
  hard: { rounds: 7, instructionTime: 10, waitTime: 10 },
};

export const useThenWhatGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [currentInstruction, setCurrentInstruction] = useState<string>("");
  const [userResponse, setUserResponse] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [results, setResults] = useState<GameResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate AI instruction
  const generateInstruction = async (): Promise<string> => {
    // This would connect to an AI service to generate instructions
    // For now, using predefined instructions that vary by difficulty
    const instructionPrompts = {
      easy: [
        "Remember to click the blue button when you see a circle",
        "Write down the number 42 when the timer reaches zero",
        "Say the word 'banana' three times in your response",
        "Count backwards from 10 to 1 and include the word 'ready'",
        "Type your name followed by the current day of the week"
      ],
      medium: [
        "When you see a red square, click it twice, then type the word 'completed'",
        "Remember the sequence: triangle, circle, square, then write it backwards",
        "Count the number of vowels in this sentence and multiply by 3",
        "Type the alphabet backwards from Z to A, skipping every third letter",
        "Calculate 15 + 27 and write the answer followed by the word 'done'"
      ],
      hard: [
        "Memorize this sequence: A1, B3, C5, D7, then write it with each letter in lowercase and each number doubled",
        "Count the number of words in this instruction, subtract 5, multiply by 2, and write the result followed by 'final answer'",
        "Remember these colors in order: red, blue, green, yellow, purple, then write them in reverse order with the first letter capitalized",
        "Take the third letter of each word in 'THE QUICK BROWN FOX' and write them as a single word",
        "Convert the time 3:45 PM to 24-hour format and add 2 hours and 30 minutes"
      ]
    };
    
    const prompts = instructionPrompts[difficulty];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };
  
  // Judge accuracy using AI (mock implementation)
  const judgeAccuracy = async (original: string, response: string): Promise<{ score: number; feedback: string }> => {
    // This would connect to an AI service for judging
    // For now, using simple string similarity and keyword matching
    
    if (!response.trim()) {
      return { score: 0, feedback: "No response provided." };
    }
    
    const originalLower = original.toLowerCase();
    const responseLower = response.toLowerCase();
    
    // Simple keyword matching for intent
    let score = 0;
    let feedback = "";
    
    // Check for exact matches or close intent
    if (originalLower.includes("click") && responseLower.includes("click")) {
      score += 30;
    }
    if (originalLower.includes("button") && responseLower.includes("button")) {
      score += 20;
    }
    if (originalLower.includes("blue") && responseLower.includes("blue")) {
      score += 25;
    }
    if (originalLower.includes("red") && responseLower.includes("red")) {
      score += 25;
    }
    if (originalLower.includes("count") && responseLower.includes("count")) {
      score += 20;
    }
    
    // Check for number preservation
    const originalNumbers = original.match(/\d+/g) || [];
    const responseNumbers = response.match(/\d+/g) || [];
    if (originalNumbers.length > 0 && responseNumbers.length > 0) {
      const matchingNumbers = originalNumbers.filter(num => responseNumbers.includes(num));
      score += (matchingNumbers.length / originalNumbers.length) * 30;
    }
    
    // Basic similarity check
    const commonWords = originalLower.split(' ').filter(word => 
      responseLower.includes(word) && word.length > 2
    );
    score += (commonWords.length / originalLower.split(' ').length) * 25;
    
    score = Math.min(100, Math.max(0, score));
    
    if (score >= 80) feedback = "Excellent! You captured the intent perfectly.";
    else if (score >= 60) feedback = "Good job! You got most of the key elements.";
    else if (score >= 40) feedback = "Partially correct. You missed some important details.";
    else if (score >= 20) feedback = "You got some elements but missed the main instruction.";
    else feedback = "This doesn't match the original instruction.";
    
    return { score: Math.round(score), feedback };
  };
  
  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameState === "instruction") {
      setGameState("wait");
      setTimeRemaining(gameConfig.waitTime);
    } else if (timeRemaining === 0 && gameState === "wait") {
      setGameState("recall");
    }
    
    return () => clearTimeout(timer);
  }, [timeRemaining, gameState, gameConfig.waitTime]);
  
  // Start the game
  const startGame = async () => {
    setIsLoading(true);
    setCurrentRound(0);
    setResults([]);
    
    try {
      const instruction = await generateInstruction();
      setCurrentInstruction(instruction);
      setGameState("instruction");
      setTimeRemaining(gameConfig.instructionTime);
    } catch (error) {
      console.error("Failed to generate instruction:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle user response input
  const handleResponseChange = (response: string) => {
    setUserResponse(response);
  };
  
  // Submit answer and move to next round or results
  const submitAnswer = async () => {
    setIsLoading(true);
    
    try {
      const { score, feedback } = await judgeAccuracy(currentInstruction, userResponse);
      
      const result: GameResult = {
        originalInstruction: currentInstruction,
        userResponse,
        accuracyScore: score,
        feedback
      };
      
      const newResults = [...results, result];
      setResults(newResults);
      
      if (currentRound + 1 < gameConfig.rounds) {
        // Next round
        const nextInstruction = await generateInstruction();
        setCurrentInstruction(nextInstruction);
        setCurrentRound(currentRound + 1);
        setUserResponse("");
        setGameState("instruction");
        setTimeRemaining(gameConfig.instructionTime);
      } else {
        // Game complete
        setGameState("result");
      }
    } catch (error) {
      console.error("Failed to judge answer:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setCurrentRound(0);
    setCurrentInstruction("");
    setUserResponse("");
    setTimeRemaining(0);
    setResults([]);
    setIsLoading(false);
  };

  const totalScore = results.reduce((sum, result) => sum + result.accuracyScore, 0);
  const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

  return {
    gameState,
    difficulty,
    currentRound,
    currentInstruction,
    userResponse,
    timeRemaining,
    results,
    isLoading,
    gameConfig,
    totalScore,
    averageScore,
    handleDifficultyChange,
    startGame,
    handleResponseChange,
    submitAnswer,
    resetGame
  };
};

export type {
  Difficulty,
  GameState,
  GameResult,
  GameConfig
};
