
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/word-searches/IntroScreen";
import PlayingScreen from "@/components/games/word-searches/PlayingScreen";
import ResultScreen from "@/components/games/word-searches/ResultScreen";
import { useWordSearchesGame } from "@/hooks/games/useWordSearchesGame";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const WordSearchesGame = () => {
  const { user } = useAuth();
  const {
    gameState,
    difficulty,
    wordSearch,
    selectedCells,
    gameConfig,
    handleDifficultyChange,
    startGame,
    handleCellClick,
    checkSelection,
    isGameComplete,
    calculateScore,
    endGame,
    resetGame
  } = useWordSearchesGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const score = calculateScore();
          const maxScore = wordSearch.words.length;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "word-searches",
            "attention",
            score,
            maxScore,
            difficultyLevel
          );
          
          console.log("Word Searches game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Word Searches game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, calculateScore, wordSearch.words.length, difficulty, user]);
  
  return (
    <GameLayout 
      title="Word Searches Exercise" 
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
      
      {gameState === "playing" && wordSearch.grid.length > 0 && (
        <PlayingScreen 
          wordSearch={wordSearch}
          selectedCells={selectedCells}
          onCellClick={handleCellClick}
          onCheckSelection={checkSelection}
          isGameComplete={isGameComplete()}
          onEndGame={endGame}
          onCancel={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={calculateScore()}
          totalWords={wordSearch.words.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default WordSearchesGame;
