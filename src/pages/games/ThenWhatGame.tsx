
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
    instructions,
    currentInstructionIndex,
    selectedAnswer,
    score,
    handleDifficultyChange,
    startGame,
    nextInstruction,
    handleAnswerSelect,
    submitAnswer,
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
          instructions={instructions}
          currentInstructionIndex={currentInstructionIndex}
          onNextInstruction={nextInstruction}
        />
      )}
      
      {gameState === "recall" && (
        <RecallScreen 
          instructions={instructions}
          currentInstructionIndex={currentInstructionIndex}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={submitAnswer}
          onCancel={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          questionsCount={instructions.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default ThenWhatGame;
