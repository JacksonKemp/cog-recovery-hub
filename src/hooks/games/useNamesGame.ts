
import { useState, useEffect } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "memorize" | "wait" | "recall" | "result";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface GameConfig {
  namesCount: number;
  memorizeTime: number;
  waitTime: number;
}

interface UserAnswers {
  [key: number]: {
    firstName: string;
    lastName: string;
  };
}

interface Score {
  correct: number;
  total: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { namesCount: 3, memorizeTime: 12, waitTime: 15 },
  medium: { namesCount: 5, memorizeTime: 15, waitTime: 15 },
  hard: { namesCount: 7, memorizeTime: 20, waitTime: 15 },
};

// Sample names for demonstration
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

export const useNamesGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [people, setPeople] = useState<Person[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Generate random names based on difficulty
  const generatePeople = (count: number): Person[] => {
    const newPeople: Person[] = [];
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      newPeople.push({
        id: i + 1,
        firstName,
        lastName
      });
    }
    
    return newPeople;
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Start the game
  const startGame = () => {
    const newPeople = generatePeople(gameConfig.namesCount);
    setPeople(newPeople);
    setTimeLeft(gameConfig.memorizeTime);
    setGameState("memorize");
    setUserAnswers({});
    setScore({ correct: 0, total: 0 });
  };

  // Handle input change for recall phase
  const handleInputChange = (personId: number, field: 'firstName' | 'lastName', value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [personId]: {
        ...prev[personId],
        [field]: value
      }
    }));
  };
  
  // Check answers
  const checkAnswers = () => {
    let correctCount = 0;
    
    people.forEach(person => {
      const userAnswer = userAnswers[person.id] || { firstName: '', lastName: '' };
      
      if (
        userAnswer.firstName?.toLowerCase() === person.firstName.toLowerCase() &&
        userAnswer.lastName?.toLowerCase() === person.lastName.toLowerCase()
      ) {
        correctCount++;
      }
    });
    
    setScore({
      correct: correctCount,
      total: people.length
    });
    
    setGameState("result");
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setPeople([]);
    setUserAnswers({});
    setScore({ correct: 0, total: 0 });
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
    people,
    userAnswers,
    score,
    handleDifficultyChange,
    startGame,
    handleInputChange,
    checkAnswers,
    resetGame
  };
};
