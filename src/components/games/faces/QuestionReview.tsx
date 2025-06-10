
import { Card, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { EmotionQuestion } from "@/hooks/games/useFacesGame";

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface QuestionReviewProps {
  question: EmotionQuestion;
  userAnswer: UserAnswer;
}

const QuestionReview = ({ question, userAnswer }: QuestionReviewProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Question Image */}
          <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={question.imagePath} 
              alt="Face expression" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Question Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium">Question {question.id}</h3>
              {userAnswer.isCorrect ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              What emotion is this face showing?
            </p>
            
            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-2">
              {question.options.map((option) => {
                const isUserAnswer = option === userAnswer.selectedAnswer;
                const isCorrectAnswer = option === userAnswer.correctAnswer;
                
                let className = "px-3 py-2 rounded-md text-sm border ";
                
                if (isCorrectAnswer && !userAnswer.isCorrect) {
                  // Highlight correct answer if user got it wrong
                  className += "bg-green-100 border-green-500 text-green-700 font-medium";
                } else if (isUserAnswer && !userAnswer.isCorrect) {
                  // Show user's wrong answer
                  className += "bg-red-100 border-red-500 text-red-700";
                } else if (isUserAnswer && userAnswer.isCorrect) {
                  // Show user's correct answer
                  className += "bg-green-100 border-green-500 text-green-700 font-medium";
                } else {
                  // Regular option
                  className += "bg-muted border-border text-muted-foreground";
                }
                
                return (
                  <div key={option} className={className}>
                    {option}
                    {isUserAnswer && " (Your answer)"}
                    {isCorrectAnswer && !userAnswer.isCorrect && " (Correct)"}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionReview;
