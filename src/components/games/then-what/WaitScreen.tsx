
import { Card, CardContent } from "@/components/ui/card";

interface WaitScreenProps {
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
}

const WaitScreen = ({ currentRound, totalRounds }: WaitScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">
        Round {currentRound + 1} of {totalRounds}
      </h2>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-lg mb-4">
            Remember the instructions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitScreen;
