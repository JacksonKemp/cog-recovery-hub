
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import DifficultySelector from "./DifficultySelector";

type Difficulty = "easy" | "medium" | "hard";

interface IntroScreenProps {
  difficulty: Difficulty;
  onDifficultyChange: (value: string) => void;
  onStartGame: () => void;
}

const IntroScreen = ({ difficulty, onDifficultyChange, onStartGame }: IntroScreenProps) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
      <p className="mb-6">
        Memorize numbers, then recall them in order.
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <DifficultySelector 
          difficulty={difficulty} 
          onDifficultyChange={onDifficultyChange} 
        />
        
        <Button onClick={onStartGame} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default IntroScreen;
