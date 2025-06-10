
import { Card, CardContent } from "@/components/ui/card";

interface InstructionScreenProps {
  currentInstruction: string;
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
}

const InstructionScreen = ({ 
  currentInstruction, 
  timeRemaining,
  currentRound,
  totalRounds
}: InstructionScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-2">
        Memorize This Instruction ({currentRound + 1} of {totalRounds})
      </h2>
      
      <div className="text-4xl font-bold text-primary mb-4">
        {timeRemaining}
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-xl font-medium">
            {currentInstruction}
          </p>
        </CardContent>
      </Card>
      
      <p className="text-muted-foreground">
        Remember this instruction carefully. You'll need to recall it exactly.
      </p>
    </div>
  );
};

export default InstructionScreen;
