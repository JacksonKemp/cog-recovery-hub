
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { WordSearch } from "@/hooks/games/useWordSearchesGame";

interface PlayingScreenProps {
  wordSearch: WordSearch;
  selectedCells: string[];
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onCheckSelection: () => void;
  isGameComplete: boolean;
  onEndGame: () => void;
  onCancel: () => void;
}

const PlayingScreen = ({ 
  wordSearch, 
  selectedCells, 
  onCellClick, 
  onCheckSelection, 
  isGameComplete,
  onEndGame,
  onCancel 
}: PlayingScreenProps) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between mb-6">
        <div>
          <h2 className="text-xl mb-2">Find these words:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {wordSearch.words.map((word) => (
              <div 
                key={word} 
                className={`px-3 py-1 border rounded-full text-sm ${
                  wordSearch.foundWords.includes(word) 
                    ? "bg-green-100 border-green-500 text-green-700" 
                    : "bg-gray-100"
                }`}
              >
                {word}
                {wordSearch.foundWords.includes(word) && (
                  <Check className="inline-block ml-1 h-4 w-4" />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Found {wordSearch.foundWords.length} of {wordSearch.words.length} words
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button onClick={onCheckSelection} disabled={selectedCells.length < 2} className="mb-2 w-full">
            Check Selection
          </Button>
          {isGameComplete() && (
            <Button onClick={onEndGame} className="w-full">
              Finish Game
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `repeat(${wordSearch.grid.length}, minmax(0, 1fr))` 
          }}>
            {wordSearch.grid.map((row, rowIndex) => 
              row.map((cell, colIndex) => {
                const cellId = `${rowIndex}-${colIndex}`;
                const isSelected = selectedCells.includes(cellId);
                
                return (
                  <button
                    key={cellId}
                    className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border font-medium rounded-md transition-colors ${
                      isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                  >
                    {cell}
                  </button>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center">
        <Button variant="outline" onClick={onCancel}>
          Cancel Game
        </Button>
      </div>
    </div>
  );
};

export default PlayingScreen;
