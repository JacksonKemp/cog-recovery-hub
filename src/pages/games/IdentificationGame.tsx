
import GameLayout from "@/components/games/GameLayout";
import { useIdentificationGame } from "@/hooks/games/useIdentificationGame";
import IntroScreen from "@/components/games/identification/IntroScreen";
import PlayingScreen from "@/components/games/identification/PlayingScreen";
import ResultScreen from "@/components/games/identification/ResultScreen";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const IdentificationGame = () => {
  const { user } = useAuth();
  const {
    gameState,
    difficulty,
    puzzles,
    currentPuzzleIndex,
    selectedIndices,
    score,
    gameConfig,
    puzzleResults,
    handleDifficultyChange,
    startGame,
    toggleOption,
    submitAnswer,
    showResults,
    resetGame
  } = useIdentificationGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const maxScore = puzzles.length * 4; // Approximate max score
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "identification",
            "attention",
            score,
            maxScore,
            difficultyLevel
          );
          
          console.log("Identification game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Identification game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, score, puzzles.length, difficulty, user]);
  
  return (
    <GameLayout 
      title="Identification Exercise" 
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
      
      {gameState === "playing" && puzzles.length > 0 && (
        <PlayingScreen 
          currentPuzzleIndex={currentPuzzleIndex}
          puzzlesCount={puzzles.length}
          currentPuzzle={puzzles[currentPuzzleIndex]}
          selectedIndices={selectedIndices}
          onToggleOption={toggleOption}
          onSubmitAnswer={submitAnswer}
          onCancelGame={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          puzzlesCount={puzzles.length}
          puzzleResults={puzzleResults}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default IdentificationGame;
