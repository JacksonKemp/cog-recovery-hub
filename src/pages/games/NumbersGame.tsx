
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/numbers/IntroScreen";
import MemorizeScreen from "@/components/games/numbers/MemorizeScreen";
import WaitScreen from "@/components/games/numbers/WaitScreen";
import RecallScreen from "@/components/games/numbers/RecallScreen";
import ResultScreen from "@/components/games/numbers/ResultScreen";
import { useNumbersGame } from "@/hooks/games/useNumbersGame";
import { saveGameProgress } from "@/services/game";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useEffect } from "react";

const NumbersGame = () => {
  const { user } = useAuth();
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

  // Save progress when game is completed
  useEffect(() => {
    const saveProgress = async () => {
      if (gameState === "result" && user) {
        try {
          const gameScore = isCorrect ? 1 : 0;
          const maxScore = 1;
          const difficultyLevel = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
          
          await saveGameProgress(
            "numbers-memory",
            "memory",
            gameScore,
            maxScore,
            difficultyLevel
          );
          
          console.log("Numbers Memory game progress saved successfully");
        } catch (error) {
          console.error("Failed to save Numbers Memory game progress:", error);
          toast.error("Failed to save game progress");
        }
      }
    };

    saveProgress();
  }, [gameState, isCorrect, difficulty, user]);
  
  return (
    <GameLayout 
      title="Numbers Memory Exercise" 
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
