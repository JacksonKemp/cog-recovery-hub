
import { useState, useEffect } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Play, Check, X } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "playing" | "result";

interface EmotionQuestion {
  id: number;
  correctEmotion: string;
  options: string[];
  imagePath: string;
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

const FacesGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [questions, setQuestions] = useState<EmotionQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
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
    if (selectedAnswer === currentQuestion.correctEmotion) {
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
  };
  
  return (
    <GameLayout title="Faces Emotion Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Match the emotion to the correct face.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Difficulty:</span>
              <Select value={difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={startGame} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Game
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "playing" && questions.length > 0 && (
        <div className="text-center">
          <h2 className="text-xl mb-6">
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          
          <Card className="mb-8">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="w-48 h-48 bg-muted rounded-full mb-6 overflow-hidden">
                <img 
                  src={questions[currentQuestionIndex].imagePath} 
                  alt="Face expression" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium mb-4">What emotion is this face showing?</h3>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {questions[currentQuestionIndex].options.map((option) => (
                  <Button 
                    key={option}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    onClick={() => handleAnswerSelect(option)}
                    className="py-6 text-base"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Cancel
            </Button>
            <Button 
              onClick={submitAnswer}
              disabled={!selectedAnswer}
            >
              {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Results: {score} out of {questions.length}
          </h2>
          
          <div className="flex justify-center mb-8">
            {score === questions.length ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <div className="text-4xl">
                {score / questions.length >= 0.5 ? "🎉" : "🤔"}
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Back
            </Button>
            <Button onClick={startGame}>
              Play Again
            </Button>
          </div>
        </div>
      )}
    </GameLayout>
  );
};

export default FacesGame;
