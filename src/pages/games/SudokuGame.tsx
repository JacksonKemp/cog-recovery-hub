
import GameLayout from "@/components/games/GameLayout";
import { useSudokuGame } from "@/hooks/games/useSudokuGame";
import IntroScreen from "@/components/games/sudoku/IntroScreen";
import PlayingScreen from "@/components/games/sudoku/PlayingScreen";
import ResultScreen from "@/components/games/sudoku/ResultScreen";

const SudokuGame = () => {
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
