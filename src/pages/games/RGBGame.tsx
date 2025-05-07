
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";

const RGBGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  return (
    <GameLayout title="Red, Green, Blue Game">
      {gameState === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Tap the colored squares when called out.
          </p>
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
            Back
          </Button>
        </div>
      )}
    </GameLayout>
  );
};

export default RGBGame;
