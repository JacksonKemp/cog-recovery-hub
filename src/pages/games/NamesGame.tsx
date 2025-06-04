
import GameLayout from "@/components/games/GameLayout";
import IntroScreen from "@/components/games/names/IntroScreen";
import MemorizeScreen from "@/components/games/names/MemorizeScreen";
import WaitScreen from "@/components/games/names/WaitScreen";
import RecallScreen from "@/components/games/names/RecallScreen";
import ResultScreen from "@/components/games/names/ResultScreen";
import { useNamesGame } from "@/hooks/games/useNamesGame";

const NamesGame = () => {
  const {
    gameState,
    difficulty,
    people,
    userAnswers,
    score,
    handleDifficultyChange,
    startGame,
    handleInputChange,
    checkAnswers,
    resetGame
  } = useNamesGame();

  return (
    <GameLayout title="Names Memory Exercise" backLink="/exercises">
      {gameState === "intro" && (
        <IntroScreen
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={startGame}
        />
      )}

      {gameState === "memorize" && (
        <MemorizeScreen people={people} />
      )}

      {gameState === "wait" && (
        <WaitScreen />
      )}

      {gameState === "recall" && (
        <RecallScreen
          people={people}
          userAnswers={userAnswers}
          onInputChange={handleInputChange}
          onCheckAnswers={checkAnswers}
          onCancel={resetGame}
        />
      )}

      {gameState === "result" && (
        <ResultScreen
          people={people}
          userAnswers={userAnswers}
          score={score}
          onBackToIntro={() => resetGame()}
          onPlayAgain={startGame}
        />
      )}
    </GameLayout>
  );
};

export default NamesGame;
