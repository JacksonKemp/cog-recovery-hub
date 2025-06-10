
import { Card, CardContent } from "@/components/ui/card";

interface InstructionScreenProps {
  currentInstruction: string;
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
}

const InstructionScreen = ({ 
  currentInstruction, 
  timeRemaining
}: InstructionScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-6">
        You have {timeRemaining} seconds to remember this instruction:
      </h2>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-xl font-medium">
            {currentInstruction}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructionScreen;
