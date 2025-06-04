
import GameLayout from "@/components/games/GameLayout";
import { useFacesGame } from "@/hooks/games/useFacesGame";
import IntroScreen from "@/components/games/faces/IntroScreen";
import PlayingScreen from "@/components/games/faces/PlayingScreen";
import ResultScreen from "@/components/games/faces/ResultScreen";

const FacesGame = () => {
  const {
    gameState,
    difficulty,
    questions,
    currentQuestionIndex,
    selectedAnswer,
    score,
    handleDifficultyChange,
    startGame,
    handleAnswerSelect,
    submitAnswer,
    resetGame
  } = useFacesGame();

  return (
    <GameLayout title="Faces Emotion Exercise">
      {gameState === "intro" && (
        <IntroScreen 
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onStartGame={startGame}
        />
      )}
      
      {gameState === "playing" && questions.length > 0 && (
        <PlayingScreen 
          currentQuestionIndex={currentQuestionIndex}
          questionsCount={questions.length}
          currentQuestion={questions[currentQuestionIndex]}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={submitAnswer}
          onCancelGame={resetGame}
        />
      )}
      
      {gameState === "result" && (
        <ResultScreen 
          score={score}
          questionsCount={questions.length}
          onPlayAgain={startGame}
          onBackToIntro={resetGame}
        />
      )}
    </GameLayout>
  );
};

export default FacesGame;
