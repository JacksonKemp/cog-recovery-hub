
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/word-finder/IntroScreen";
import PlayingScreen from "@/components/games/word-finder/PlayingScreen";
import ResultScreen from "@/components/games/word-finder/ResultScreen";
import { useWordFinderGame } from "@/hooks/games/useWordFinderGame";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const WordFinderGame = () => {
  const { user } = useAuth();
  const {
    gameState,
    difficulty,
    puzzles,
    currentPuzzleIndex,
    selectedWordIndex,
    score,
    gameConfig,
    handleDifficultyChange,
    startGame,
    handleWordSelect,
    submitAnswer,
    resetGame
  } = useWordFinderGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const maxScore = puzzles.length;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "word-finder",
            "processing",
            score,
            maxScore,
            difficultyLevel
          );
          
          console.log("Word Finder game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Word Finder game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, score, puzzles.length, difficulty, user]);
  
  return (
    <GameLayout 
      title="Word Finder Exercise" 
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
          puzzleCount={puzzles.length}
          currentPuzzle={puzzles[currentPuzzleIndex]}
          selectedWordIndex={selectedWordIndex}
          onWordSelect={handleWordSelect}
          onSubmitAnswer={submitAnswer}
          onCancel={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          totalPuzzles={puzzles.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default WordFinderGame;
