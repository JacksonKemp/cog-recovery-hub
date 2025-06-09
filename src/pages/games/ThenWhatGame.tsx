
import GameLayout from "@/components/games/GameLayout";
import { useThenWhatGame } from "@/hooks/games/useThenWhatGame";
import IntroScreen from "@/components/games/then-what/IntroScreen";
import InstructionScreen from "@/components/games/then-what/InstructionScreen";
import RecallScreen from "@/components/games/then-what/RecallScreen";
import ResultScreen from "@/components/games/then-what/ResultScreen";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const ThenWhatGame = () => {
  const { user } = useAuth();
  const {
    gameState,
    difficulty,
    instructions,
    currentInstructionIndex,
    selectedAnswer,
    score,
    handleDifficultyChange,
    startGame,
    nextInstruction,
    handleAnswerSelect,
    submitAnswer,
    resetGame
  } = useThenWhatGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const maxScore = instructions.length;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "then-what",
            "processing",
            score,
            maxScore,
            difficultyLevel
          );
          
          console.log("Then What game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Then What game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, score, instructions.length, difficulty, user]);

  return (
    <GameLayout 
      title="Then What Exercise" 
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
      
      {gameState === "instruction" && (
        <InstructionScreen 
          instructions={instructions}
          currentInstructionIndex={currentInstructionIndex}
          onNextInstruction={nextInstruction}
        />
      )}
      
      {gameState === "recall" && (
        <RecallScreen 
          instructions={instructions}
          currentInstructionIndex={currentInstructionIndex}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={submitAnswer}
          onCancel={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          totalQuestions={instructions.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default ThenWhatGame;
