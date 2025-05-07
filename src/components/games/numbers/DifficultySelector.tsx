
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type Difficulty = "easy" | "medium" | "hard";

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (value: string) => void;
}

const DifficultySelector = ({ difficulty, onDifficultyChange }: DifficultySelectorProps) => {
  return (
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
  );
};

export default DifficultySelector;
