
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/word-searches/IntroScreen";
import PlayingScreen from "@/components/games/word-searches/PlayingScreen";
import ResultScreen from "@/components/games/word-searches/ResultScreen";
import { useWordSearchesGame } from "@/hooks/games/useWordSearchesGame";

const WordSearchesGame = () => {
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
  
  return (
    <GameLayout title="Word Searches Game">
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
