
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/rgb/IntroScreen";
import PlayingScreen from "@/components/games/rgb/PlayingScreen";
import ResultScreen from "@/components/games/rgb/ResultScreen";
import { useRGBGame } from "@/hooks/games/useRGBGame";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const RGBGame = () => {
  const { user } = useAuth();
  const {
    gameState,
    difficulty,
    squares,
    currentTargetColor,
    showColorPrompt,
    score,
    timeLeft,
    gameConfig,
    isColorChanging,
    handleDifficultyChange,
    startGame,
    handleSquareClick,
    resetGame
  } = useRGBGame();

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "rgb-reaction",
            "attention",
            score,
            undefined, // No max score for reaction time game
            difficultyLevel,
            gameConfig.gameDuration
          );
          
          console.log("RGB reaction game progress saved successfully");
        } catch (error) {
          console.error("Failed to save RGB reaction game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, score, gameConfig.gameDuration, difficulty, user]);
  
  return (
    <GameLayout 
      title="Red, Green, Blue Reaction" 
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
      
      {gameState === "playing" && (
        <PlayingScreen 
          squares={squares}
          currentTargetColor={currentTargetColor}
          showColorPrompt={showColorPrompt}
          score={score}
          timeLeft={timeLeft}
          isColorChanging={isColorChanging}
          onSquareClick={handleSquareClick}
          onEndGame={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          gameDuration={gameConfig.gameDuration}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default RGBGame;
