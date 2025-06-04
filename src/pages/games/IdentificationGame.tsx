
import GameLayout from "@/components/games/GameLayout";
import { useIdentificationGame } from "@/hooks/games/useIdentificationGame";
import IntroScreen from "@/components/games/identification/IntroScreen";
import PlayingScreen from "@/components/games/identification/PlayingScreen";
import ResultScreen from "@/components/games/identification/ResultScreen";

const IdentificationGame = () => {
  const {
    gameState,
    difficulty,
    puzzles,
    currentPuzzleIndex,
    selectedIndices,
    score,
    gameConfig,
    handleDifficultyChange,
    startGame,
    toggleOption,
    submitAnswer,
    resetGame
  } = useIdentificationGame();
  
  return (
    <GameLayout title="Identification Exercise">
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
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default IdentificationGame;
