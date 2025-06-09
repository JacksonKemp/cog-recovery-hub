
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
    currentRound,
    squares,
    targetColor,
    roundsCorrect,
    gameConfig,
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
          const score = roundsCorrect;
          const maxScore = gameConfig.rounds;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "rgb-game",
            "attention",
            score,
            maxScore,
            difficultyLevel
          );
          
          console.log("RGB game progress saved successfully");
        } catch (error) {
          console.error("Failed to save RGB game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, roundsCorrect, gameConfig.rounds, difficulty, user]);
  
  return (
    <GameLayout 
      title="Red, Green, Blue Exercise" 
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
      
      {gameState === "playing" && targetColor && (
        <PlayingScreen 
          currentRound={currentRound}
          totalRounds={gameConfig.rounds}
          targetColor={targetColor}
          squares={squares}
          squaresPerRound={gameConfig.squaresPerRound}
          onSquareClick={handleSquareClick}
          onEndGame={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          roundsCorrect={roundsCorrect}
          totalRounds={gameConfig.rounds}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default RGBGame;
