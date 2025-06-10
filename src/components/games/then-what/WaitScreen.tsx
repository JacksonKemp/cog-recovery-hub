
import { Card, CardContent } from "@/components/ui/card";

interface WaitScreenProps {
  timeRemaining: number;
  currentRound: number;
  totalRounds: number;
}

const WaitScreen = ({ timeRemaining, currentRound, totalRounds }: WaitScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-xl mb-4">
        Round {currentRound + 1} of {totalRounds}
      </h2>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="text-lg mb-4">
            Remember the instruction...
          </p>
          <div className="text-6xl font-bold text-primary mb-4">
            {timeRemaining}
          </div>
          <p className="text-muted-foreground">
            You'll be asked to recall it soon
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitScreen;
