import { useState } from "react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";

export interface EmotionQuestion {
  id: number;
  correctEmotion: string;
  options: string[];
  imagePath: string;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface GameConfig {
  questionsCount: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { questionsCount: 5 },
  medium: { questionsCount: 8 },
  hard: { questionsCount: 12 },
};

// Sample emotions for the game
const emotions = [
  "Happy", "Sad", "Angry", "Surprised", 
  "Scared", "Disgusted", "Confused", "Neutral"
];

export const useFacesGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questions, setQuestions] = useState<EmotionQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate questions based on difficulty
  const generateQuestions = (count: number): EmotionQuestion[] => {
    // This is a placeholder - in a real game, you would have actual images
    const generatedQuestions: EmotionQuestion[] = [];
    
    for (let i = 0; i < count; i++) {
      const correctEmotion = emotions[i % emotions.length];
      
      // Create 3 random options plus the correct one
      const otherEmotions = emotions.filter(emotion => emotion !== correctEmotion);
      const shuffledEmotions = otherEmotions.sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffledEmotions, correctEmotion].sort(() => Math.random() - 0.5);
      
      generatedQuestions.push({
        id: i + 1,
        correctEmotion,
        options,
        // Placeholder for actual images - would be replaced with real images
        imagePath: `/placeholder.svg` 
      });
    }
    
    return generatedQuestions;
  };
  
  // Start the game
  const startGame = () => {
    const newQuestions = generateQuestions(gameConfig.questionsCount);
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setUserAnswers([]);
    setGameState("playing");
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  // Submit current answer and move to next question
  const submitAnswer = () => {
    if (!selectedAnswer) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctEmotion;
    
    // Record the user's answer
    const newUserAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      correctAnswer: currentQuestion.correctEmotion,
      isCorrect
    };
    
    setUserAnswers(prev => [...prev, newUserAnswer]);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Move to next question or end the game if no more questions
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      setGameState("result");
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setUserAnswers([]);
  };

  return {
    gameState,
    difficulty,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    score,
    gameConfig,
    userAnswers,
    handleDifficultyChange,
    startGame,
    handleAnswerSelect,
    submitAnswer,
    resetGame
  };
};
