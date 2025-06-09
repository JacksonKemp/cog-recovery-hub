
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/names/IntroScreen";
import MemorizeScreen from "@/components/games/names/MemorizeScreen";
import WaitScreen from "@/components/games/names/WaitScreen";
import RecallScreen from "@/components/games/names/RecallScreen";
import ResultScreen from "@/components/games/names/ResultScreen";
import { useNamesGame } from "@/hooks/games/useNamesGame";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const NamesGame = () => {
  const { user } = useAuth();
  const {
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
  } = useNamesGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const maxScore = people.length;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "names-memory",
            "memory",
            score.correct,
            maxScore,
            difficultyLevel
          );
          
          console.log("Names Memory game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Names Memory game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, score.correct, people.length, difficulty, user]);

  return (
    <GameLayout 
      title="Names Memory Exercise" 
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

      {gameState === "memorize" && (
        <MemorizeScreen people={people} />
      )}

      {gameState === "wait" && (
        <WaitScreen />
      )}

      {gameState === "recall" && (
        <RecallScreen
          people={people}
          userAnswers={userAnswers}
          onInputChange={handleInputChange}
          onCheckAnswers={checkAnswers}
          onCancel={resetGame}
        />
      )}

      {gameState === "result" && (
        <ResultScreen
          people={people}
          userAnswers={userAnswers}
          score={score}
          onBackToIntro={() => resetGame()}
          onPlayAgain={startGame}
        />
      )}
    </GameLayout>
  );
};

export default NamesGame;
