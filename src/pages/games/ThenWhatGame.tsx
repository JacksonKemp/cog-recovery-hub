
import GameLayout from "@/components/games/GameLayout";
import { useThenWhatGame } from "@/hooks/games/useThenWhatGame";
import IntroScreen from "@/components/games/then-what/IntroScreen";
import InstructionScreen from "@/components/games/then-what/InstructionScreen";
import WaitScreen from "@/components/games/then-what/WaitScreen";
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
    currentRound,
    currentInstruction,
    userResponse,
    timeRemaining,
    results,
    isLoading,
    gameConfig,
    averageScore,
    handleDifficultyChange,
    startGame,
    handleResponseChange,
    submitAnswer,
    resetGame
  } = useThenWhatGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const maxScore = 100; // Average accuracy is out of 100
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "then-what",
            "processing",
            averageScore,
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
  }, [gameState, averageScore, difficulty, user]);

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
          isLoading={isLoading}
        />
      )}
      
      {gameState === "instruction" && (
        <InstructionScreen 
          currentInstruction={currentInstruction}
          timeRemaining={timeRemaining}
          currentRound={currentRound}
          totalRounds={gameConfig.rounds}
        />
      )}
      
      {gameState === "wait" && (
        <WaitScreen 
          timeRemaining={timeRemaining}
          currentRound={currentRound}
          totalRounds={gameConfig.rounds}
        />
      )}
      
      {gameState === "recall" && (
        <RecallScreen 
          currentRound={currentRound}
          totalRounds={gameConfig.rounds}
          userResponse={userResponse}
          onResponseChange={handleResponseChange}
          onSubmitAnswer={submitAnswer}
          onCancel={resetGame}
          isLoading={isLoading}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          averageScore={averageScore}
          totalRounds={gameConfig.rounds}
          results={results}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default ThenWhatGame;
