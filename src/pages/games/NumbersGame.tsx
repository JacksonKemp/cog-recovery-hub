
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/numbers/IntroScreen";
import MemorizeScreen from "@/components/games/numbers/MemorizeScreen";
import WaitScreen from "@/components/games/numbers/WaitScreen";
import RecallScreen from "@/components/games/numbers/RecallScreen";
import ResultScreen from "@/components/games/numbers/ResultScreen";
import { useNumbersGame } from "@/hooks/games/useNumbersGame";

const NumbersGame = () => {
  const {
    gameState,
    difficulty,
    numbers,
    userInput,
    isCorrect,
    score,
    handleDifficultyChange,
    startGame,
    checkAnswer,
    resetGame,
    handleUserInputChange
  } = useNumbersGame();
  
  return (
    <GameLayout title="Numbers Memory Exercise" backLink="/exercises">
      {gameState === "intro" && (
        <IntroScreen 
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={startGame}
        />
      )}
      
      {gameState === "memorize" && (
        <MemorizeScreen numbers={numbers} />
      )}
      
      {gameState === "wait" && (
        <WaitScreen />
      )}
      
      {gameState === "recall" && (
        <RecallScreen 
          userInput={userInput}
          onUserInputChange={handleUserInputChange}
          onCheckAnswer={checkAnswer}
          onCancel={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          isCorrect={isCorrect}
          numbers={numbers}
          userInput={userInput}
          score={score}
          onBackToIntro={() => resetGame()}
          onPlayAgain={startGame}
        />
      )}
    </GameLayout>
  );
};

export default NumbersGame;
