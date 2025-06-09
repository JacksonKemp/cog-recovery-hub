
import GameLayout from "@/components/games/GameLayout";
import { useSudokuGame } from "@/hooks/games/useSudokuGame";
import IntroScreen from "@/components/games/sudoku/IntroScreen";
import PlayingScreen from "@/components/games/sudoku/PlayingScreen";
import ResultScreen from "@/components/games/sudoku/ResultScreen";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const SudokuGame = () => {
  const { user } = useAuth();
  const {
    gameState,
    difficulty,
    originalGrid,
    currentGrid,
    selectedCell,
    isValid,
    handleDifficultyChange,
    startGame,
    handleCellClick,
    handleNumberInput,
    checkSolution,
    resetPuzzle,
    resetGame
  } = useSudokuGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const score = isValid ? 1 : 0;
          const maxScore = 1;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "sudoku",
            "processing",
            score,
            maxScore,
            difficultyLevel
          );
          
          console.log("Sudoku game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Sudoku game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, isValid, difficulty, user]);

  return (
    <GameLayout 
      title="Sudoku Exercise" 
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
      
      {gameState === "playing" && currentGrid.length > 0 && (
        <PlayingScreen 
          originalGrid={originalGrid}
          currentGrid={currentGrid}
          selectedCell={selectedCell}
          isValid={isValid}
          onCellClick={handleCellClick}
          onNumberInput={handleNumberInput}
          onCheckSolution={checkSolution}
          onResetPuzzle={resetPuzzle}
          onResetGame={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          isValid={isValid}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default SudokuGame;
