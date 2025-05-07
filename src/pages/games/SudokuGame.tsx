
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";

const SudokuGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  return (
    <GameLayout title="Sudoku Game">
      {gameState === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Fill in the 9×9 grid with digits so that each column, each row, and each of the 
            nine 3×3 subgrids contains all of the digits from 1 to 9.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Difficulty Levels</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>Easy: More starting numbers, fewer cells to fill</li>
              <li>Medium: Balanced challenge with moderate starting numbers</li>
              <li>Hard: Fewer starting numbers, requiring more complex strategies</li>
            </ul>
          </div>
          <Button onClick={() => setGameState('playing')} className="mb-4">
            Start Game
          </Button>
          <p className="text-muted-foreground text-sm">
            Coming Soon - This game is currently under development
          </p>
        </div>
      )}
      
      {gameState === 'playing' && (
        <div className="text-center">
          <p className="text-xl mb-6">Game Coming Soon!</p>
          <Button onClick={() => setGameState('intro')}>
            Back to Instructions
          </Button>
        </div>
      )}
    </GameLayout>
  );
};

export default SudokuGame;
