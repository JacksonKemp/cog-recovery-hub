
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";

const NumbersGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  return (
    <GameLayout title="Numbers Memory Game">
      {gameState === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            You will be shown a sequence of numbers for a short time. Memorize them, 
            wait for 15 seconds, and then enter them back in the correct order.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Difficulty Levels</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>Easy: 5 digits, 10 seconds to memorize</li>
              <li>Medium: 7 digits, 7 seconds to memorize</li>
              <li>Hard: 9 digits, 5 seconds to memorize</li>
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

export default NumbersGame;
