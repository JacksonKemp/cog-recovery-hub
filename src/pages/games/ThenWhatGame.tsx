
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/then-what/IntroScreen";
import InstructionScreen from "@/components/games/then-what/InstructionScreen";
import RecallScreen from "@/components/games/then-what/RecallScreen";
import ResultScreen from "@/components/games/then-what/ResultScreen";
import { useThenWhatGame } from "@/hooks/games/useThenWhatGame";

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
    <GameLayout title="Then What Exercise">
      {gameState === "intro" && (
        <IntroScreen
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={startGame}
        />
      )}
      
      {gameState === "instruction" && instructions.length > 0 && (
        <InstructionScreen
          instructions={instructions}
          currentInstructionIndex={currentInstructionIndex}
          onNextInstruction={nextInstruction}
        />
      )}
      
      {gameState === "recall" && instructions.length > 0 && (
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
          totalQuestions={instructions.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default ThenWhatGame;
