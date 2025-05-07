
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface UserAnswers {
  [key: number]: {
    firstName: string;
    lastName: string;
  };
}

interface Score {
  correct: number;
  total: number;
}

interface ResultScreenProps {
  people: Person[];
  userAnswers: UserAnswers;
  score: Score;
  onBackToIntro: () => void;
  onPlayAgain: () => void;
}

const ResultScreen = ({ 
  people, 
  userAnswers, 
  score, 
  onBackToIntro, 
  onPlayAgain 
}: ResultScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-6">
        Results: {score.correct} out of {score.total}
      </h2>
      
      <div className="flex justify-center mb-8">
        {score.correct === score.total ? (
          <Check className="h-16 w-16 text-green-500" />
        ) : (
          <div className="text-4xl">
            {score.correct / score.total >= 0.5 ? "🎉" : "🤔"}
          </div>
        )}
      </div>
      
      <div className="space-y-4 mb-8 max-w-md mx-auto">
        <h3 className="text-lg font-medium">Correct Answers:</h3>
        {people.map((person) => {
          const userAnswer = userAnswers[person.id] || { firstName: '', lastName: '' };
          const isFirstNameCorrect = userAnswer.firstName?.toLowerCase() === person.firstName.toLowerCase();
          const isLastNameCorrect = userAnswer.lastName?.toLowerCase() === person.lastName.toLowerCase();
          
          return (
            <div key={person.id} className="border rounded-md p-3">
              <div className="font-medium">Person #{person.id}</div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">First Name</div>
                  <div className="flex justify-between items-center">
                    <span className={isFirstNameCorrect ? "text-green-600" : "text-red-600"}>
                      {person.firstName}
                    </span>
                    {isFirstNameCorrect ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />
                    }
                  </div>
                  {!isFirstNameCorrect && (
                    <div className="text-xs text-muted-foreground">
                      Your answer: {userAnswer.firstName || "(blank)"}
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="text-xs text-muted-foreground">Last Name</div>
                  <div className="flex justify-between items-center">
                    <span className={isLastNameCorrect ? "text-green-600" : "text-red-600"}>
                      {person.lastName}
                    </span>
                    {isLastNameCorrect ? 
                      <Check className="h-4 w-4 text-green-500" /> : 
                      <X className="h-4 w-4 text-red-500" />
                    }
                  </div>
                  {!isLastNameCorrect && (
                    <div className="text-xs text-muted-foreground">
                      Your answer: {userAnswer.lastName || "(blank)"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBackToIntro}>
          Back
        </Button>
        <Button onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default ResultScreen;
