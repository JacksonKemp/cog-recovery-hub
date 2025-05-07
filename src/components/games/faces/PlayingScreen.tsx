
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { EmotionQuestion } from "@/hooks/games/useFacesGame";

interface PlayingScreenProps {
  currentQuestionIndex: number;
  questionsCount: number;
  currentQuestion: EmotionQuestion;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
  onCancelGame: () => void;
}

const PlayingScreen = ({ 
  currentQuestionIndex, 
  questionsCount,
  currentQuestion,
  selectedAnswer,
  onAnswerSelect,
  onSubmitAnswer,
  onCancelGame
}: PlayingScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">
        Question {currentQuestionIndex + 1} of {questionsCount}
      </h2>
      
      <Card className="mb-8">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="w-48 h-48 bg-muted rounded-full mb-6 overflow-hidden">
            <img 
              src={currentQuestion.imagePath} 
              alt="Face expression" 
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-medium mb-4">What emotion is this face showing?</h3>
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {currentQuestion.options.map((option) => (
              <Button 
                key={option}
                variant={selectedAnswer === option ? "default" : "outline"}
                onClick={() => onAnswerSelect(option)}
                className="py-6 text-base"
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancelGame}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmitAnswer}
          disabled={!selectedAnswer}
        >
          {currentQuestionIndex < questionsCount - 1 ? "Next" : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default PlayingScreen;
