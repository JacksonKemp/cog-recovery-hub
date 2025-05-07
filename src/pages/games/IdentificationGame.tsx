
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";

const IdentificationGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  return (
    <GameLayout title="Identification Game">
      {gameState === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Select objects based on specific instructions. This game tests your 
            ability to follow directions and identify objects correctly.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Game Rules</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>You will be given an instruction (e.g., "Touch all the red circles")</li>
              <li>A grid of shapes with different colors will appear</li>
              <li>Select all objects that match the instruction</li>
              <li>Instructions become more complex as you progress</li>
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

export default IdentificationGame;
