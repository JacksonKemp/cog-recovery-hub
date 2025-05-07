
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InstructionTask } from "@/hooks/games/useThenWhatGame";

interface RecallScreenProps {
  instructions: InstructionTask[];
  currentInstructionIndex: number;
  selectedAnswer: string;
  onAnswerSelect: (answer: string) => void;
  onSubmitAnswer: () => void;
  onCancel: () => void;
}

const RecallScreen = ({ 
  instructions, 
  currentInstructionIndex, 
  selectedAnswer, 
  onAnswerSelect, 
  onSubmitAnswer, 
  onCancel 
}: RecallScreenProps) => {
  const currentInstruction = instructions[currentInstructionIndex];

  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">
        Recall ({currentInstructionIndex + 1} of {instructions.length})
      </h2>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <p className="text-lg font-medium mb-4">
            What was the instruction about?
          </p>
          
          {currentInstruction.choices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentInstruction.choices?.map((choice, index) => (
                <Button 
                  key={index}
                  variant={selectedAnswer === choice ? "default" : "outline"}
                  onClick={() => onAnswerSelect(choice)}
                >
                  {choice}
                </Button>
              ))}
            </div>
          ) : (
            <div className="mb-4">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => onAnswerSelect(e.target.value)}
                placeholder="Enter your answer"
                className="w-full p-3 border rounded-md"
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={onSubmitAnswer}
          disabled={!selectedAnswer && currentInstruction.choices !== undefined}
        >
          {currentInstructionIndex < instructions.length - 1 ? "Next" : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default RecallScreen;
