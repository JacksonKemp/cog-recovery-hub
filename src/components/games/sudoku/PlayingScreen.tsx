
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { RotateCcw } from "lucide-react";
import { SudokuGrid } from "@/hooks/games/useSudokuGame";

interface PlayingScreenProps {
  originalGrid: SudokuGrid;
  currentGrid: SudokuGrid;
  selectedCell: [number, number] | null;
  isValid: boolean;
  onCellClick: (rowIndex: number, colIndex: number) => void;
  onNumberInput: (number: number) => void;
  onCheckSolution: () => void;
  onResetPuzzle: () => void;
  onResetGame: () => void;
}

const PlayingScreen = ({ 
  originalGrid, 
  currentGrid, 
  selectedCell,
  isValid, 
  onCellClick, 
  onNumberInput, 
  onCheckSolution, 
  onResetPuzzle, 
  onResetGame 
}: PlayingScreenProps) => {
  
  // Render number input buttons
  const renderNumberButtons = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-6">
        {numbers.map(number => (
          <Button 
            key={number}
            onClick={() => onNumberInput(number)}
            disabled={!selectedCell}
            variant="outline"
            className="w-12 h-12 text-lg font-bold"
          >
            {number}
          </Button>
        ))}
        <Button 
          onClick={() => onNumberInput(0)}
          disabled={!selectedCell}
          variant="outline"
          className="w-12 h-12 text-sm"
        >
          Clear
        </Button>
      </div>
    );
  };
  
  return (
    <div className="text-center">
      <Card className="mb-6 max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="grid grid-cols-9 bg-white border border-gray-300 shadow-sm">
            {currentGrid.map((row, rowIndex) => 
              row.map((cell, colIndex) => {
                const isOriginal = originalGrid[rowIndex][colIndex] !== 0;
                const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
                const isSameRow = selectedCell && selectedCell[0] === rowIndex;
                const isSameCol = selectedCell && selectedCell[1] === colIndex;
                const isSameBox = 
                  selectedCell && 
                  Math.floor(rowIndex / 3) === Math.floor(selectedCell[0] / 3) &&
                  Math.floor(colIndex / 3) === Math.floor(selectedCell[1] / 3);
                
                const borderClasses = [
                  // Horizontal lines
                  (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? "border-b-2 border-gray-400" : "border-b border-gray-300",
                  // Vertical lines
                  (colIndex + 1) % 3 === 0 && colIndex < 8 ? "border-r-2 border-gray-400" : "border-r border-gray-300"
                ].filter(Boolean).join(" ");
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center 
                      font-medium text-lg relative ${borderClasses}
                      ${isOriginal ? "font-bold" : "text-blue-600"}
                      ${isSelected ? "bg-blue-200" : ""}
                      ${!isSelected && (isSameRow || isSameCol) ? "bg-blue-50" : ""}
                      ${!isSelected && isSameBox && !(isSameRow || isSameCol) ? "bg-blue-50" : ""}
                    `}
                    onClick={() => onCellClick(rowIndex, colIndex)}
                  >
                    {cell !== 0 ? cell : ""}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
      
      {renderNumberButtons()}
      
      <div className="flex justify-center gap-4 mt-6">
        <Button variant="outline" onClick={onResetPuzzle} className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button onClick={onCheckSolution} disabled={!isValid} className="px-6">
          Check Solution
        </Button>
        <Button variant="outline" onClick={onResetGame}>
          Quit
        </Button>
      </div>
    </div>
  );
};

export default PlayingScreen;
