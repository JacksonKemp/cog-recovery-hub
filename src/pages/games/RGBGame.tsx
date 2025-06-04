
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/rgb/IntroScreen";
import PlayingScreen from "@/components/games/rgb/PlayingScreen";
import ResultScreen from "@/components/games/rgb/ResultScreen";
import { useRGBGame } from "@/hooks/games/useRGBGame";

const RGBGame = () => {
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
  
  return (
    <GameLayout title="Red, Green, Blue Exercise">
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
