
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InstructionTask } from "@/hooks/games/useThenWhatGame";

interface InstructionScreenProps {
  instructions: InstructionTask[];
  currentInstructionIndex: number;
  onNextInstruction: () => void;
}

const InstructionScreen = ({ 
  instructions, 
  currentInstructionIndex, 
  onNextInstruction 
}: InstructionScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-2">
        Remember This Instruction ({currentInstructionIndex + 1} of {instructions.length})
      </h2>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-xl font-medium mb-4">
            {instructions[currentInstructionIndex].text}
          </p>
        </CardContent>
      </Card>
      
      <Button onClick={onNextInstruction}>
        {currentInstructionIndex < instructions.length - 1 ? "Next Instruction" : "Start Recall"}
      </Button>
    </div>
  );
};

export default InstructionScreen;
