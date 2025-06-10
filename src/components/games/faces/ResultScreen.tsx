
import { Button } from "@/components/ui/button";
import { Check, ScrollText } from "lucide-react";
import { useState } from "react";
import { EmotionQuestion } from "@/hooks/games/useFacesGame";
import QuestionReview from "./QuestionReview";

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ResultScreenProps {
  score: number;
  questionsCount: number;
  questions: EmotionQuestion[];
  userAnswers: UserAnswer[];
  onPlayAgain: () => void;
  onBackToIntro: () => void;
}

const ResultScreen = ({ 
  score, 
  questionsCount,
  questions,
  userAnswers,
  onPlayAgain, 
  onBackToIntro 
}: ResultScreenProps) => {
  const [showReview, setShowReview] = useState(false);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Results: {score} out of {questionsCount}
      </h2>
      
      <div className="flex justify-center mb-8">
        {score === questionsCount ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {score / questionsCount >= 0.5 ? "🎉" : "🤔"}
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4 mb-6">
        <Button variant="outline" onClick={onBackToIntro}>
          Back
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setShowReview(!showReview)}
          className="flex items-center gap-2"
        >
          <ScrollText className="h-4 w-4" />
          {showReview ? "Hide Review" : "Review Answers"}
        </Button>
        <Button onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>

      {showReview && (
        <div className="mt-8 text-left">
          <h3 className="text-lg font-semibold mb-4 text-center">Answer Review</h3>
          <div className="max-h-96 overflow-y-auto">
            {questions.map((question) => {
              const userAnswer = userAnswers.find(answer => answer.questionId === question.id);
              if (!userAnswer) return null;
              
              return (
                <QuestionReview 
                  key={question.id}
                  question={question}
                  userAnswer={userAnswer}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
