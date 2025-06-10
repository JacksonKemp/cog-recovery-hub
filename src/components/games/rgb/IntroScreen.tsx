
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type Difficulty = "easy" | "medium" | "hard";

interface IntroScreenProps {
  difficulty: Difficulty;
  onDifficultyChange: (value: string) => void;
  onStartGame: () => void;
}

const IntroScreen = ({ difficulty, onDifficultyChange, onStartGame }: IntroScreenProps) => {
  const getDifficultyDescription = (diff: Difficulty) => {
    switch (diff) {
      case "easy":
        return "1 second to react";
      case "medium":
        return "0.75 seconds to react";
      case "hard":
        return "0.5 seconds to react";
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
      <div className="mb-6 space-y-3">
        <p>You'll see three colored squares: red, green, and blue.</p>
        <p>When a color name appears, quickly tap the matching colored square!</p>
        <p>You have limited time to react - be fast and accurate.</p>
        <p className="text-sm text-muted-foreground">Game lasts 60 seconds.</p>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <span>Difficulty:</span>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
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
        
        <p className="text-sm text-muted-foreground">
          {getDifficultyDescription(difficulty)}
        </p>
        
        <Button onClick={onStartGame} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default IntroScreen;
