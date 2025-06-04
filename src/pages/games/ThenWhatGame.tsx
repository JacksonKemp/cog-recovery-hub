
import GameLayout from "@/components/games/GameLayout";
import { useThenWhatGame } from "@/hooks/games/useThenWhatGame";
import IntroScreen from "@/components/games/then-what/IntroScreen";
import InstructionScreen from "@/components/games/then-what/InstructionScreen";
import RecallScreen from "@/components/games/then-what/RecallScreen";
import ResultScreen from "@/components/games/then-what/ResultScreen";

const ThenWhatGame = () => {
  const {
    gameState,
    difficulty,
    steps,
    currentStepIndex,
    userAnswers,
    score,
    handleDifficultyChange,
    startGame,
    handleAnswerSubmit,
    resetGame
  } = useThenWhatGame();

  return (
    <GameLayout title="Then What Exercise" backLink="/exercises">
      {gameState === "intro" && (
        <IntroScreen 
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={startGame}
        />
      )}
      
      {gameState === "instruction" && (
        <InstructionScreen 
          steps={steps}
          onContinue={startGame}
        />
      )}
      
      {gameState === "playing" && (
        <RecallScreen 
          steps={steps}
          currentStepIndex={currentStepIndex}
          userAnswers={userAnswers}
          onAnswerSubmit={handleAnswerSubmit}
          onResetGame={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          totalSteps={steps.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default ThenWhatGame;
