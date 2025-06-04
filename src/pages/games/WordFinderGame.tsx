
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/word-finder/IntroScreen";
import PlayingScreen from "@/components/games/word-finder/PlayingScreen";
import ResultScreen from "@/components/games/word-finder/ResultScreen";
import { useWordFinderGame } from "@/hooks/games/useWordFinderGame";

const WordFinderGame = () => {
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
  
  return (
    <GameLayout title="Word Finder Exercise">
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
