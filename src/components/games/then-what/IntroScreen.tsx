
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Difficulty } from "@/hooks/games/useThenWhatGame";

interface IntroScreenProps {
  difficulty: Difficulty;
  onDifficultyChange: (value: string) => void;
  onStartGame: () => void;
  isLoading: boolean;
}

const IntroScreen = ({ difficulty, onDifficultyChange, onStartGame, isLoading }: IntroScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
      <p className="mb-6">
        You'll receive AI-generated instructions to memorize. After a timed viewing period, 
        you'll wait while remembering, then type the instruction as accurately as possible. 
        AI will judge your accuracy based on intent and meaning.
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span>Difficulty:</span>
          <Select value={difficulty} onValueChange={onDifficultyChange} disabled={isLoading}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={onStartGame} className="flex items-center gap-2" disabled={isLoading}>
          <Play className="h-4 w-4" />
          {isLoading ? "Generating..." : "Start Game"}
        </Button>
      </div>
    </div>
  );
};

export default IntroScreen;
