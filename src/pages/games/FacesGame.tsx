
import GameLayout from "@/components/games/GameLayout";
import { useFacesGame } from "@/hooks/games/useFacesGame";
import IntroScreen from "@/components/games/faces/IntroScreen";
import PlayingScreen from "@/components/games/faces/PlayingScreen";
import ResultScreen from "@/components/games/faces/ResultScreen";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const FacesGame = () => {
  const { user } = useAuth();
  const {
    gameState,
    difficulty,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    score,
    handleDifficultyChange,
    startGame,
    handleAnswerSelect,
    submitAnswer,
    resetGame
  } = useFacesGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const maxScore = questions.length;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "faces-emotion",
            "attention",
            score,
            maxScore,
            difficultyLevel
          );
          
          console.log("Faces Emotion game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Faces Emotion game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, score, questions.length, difficulty, user]);

  return (
    <GameLayout 
      title="Faces Emotion Exercise" 
      backLink="/games"
      showTitle={gameState === "intro"}
    >
      {gameState === "intro" && (
        <IntroScreen 
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={startGame}
        />
      )}
      
      {gameState === "playing" && questions.length > 0 && (
        <PlayingScreen 
          currentQuestionIndex={currentQuestionIndex}
          questionsCount={questions.length}
          currentQuestion={questions[currentQuestionIndex]}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={submitAnswer}
          onCancelGame={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          questionsCount={questions.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default FacesGame;
