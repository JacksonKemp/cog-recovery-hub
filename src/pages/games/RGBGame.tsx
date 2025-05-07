
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
            Test your reflexes by tapping colored squares as they are called out.
            The game lasts for 60 seconds, with colors changing faster as you progress.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Game Rules</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>Tap the colored square that matches the color name played aloud</li>
              <li>Score points for each correct tap</li>
              <li>The game gets faster as your score increases</li>
              <li>More colors are introduced at higher levels</li>
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

export default RGBGame;
