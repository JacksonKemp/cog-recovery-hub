
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";

const FacesGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  return (
    <GameLayout title="Faces Emotion Game">
      {gameState === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            You will be shown 4 faces displaying different emotions. Select the face
            that matches the emotion word shown.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Difficulty Levels</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>Easy: Basic emotions (happy, sad, angry)</li>
              <li>Medium: More nuanced emotions (frustrated, surprised, confused)</li>
              <li>Hard: Subtle emotions (contemplative, anxious, wistful)</li>
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

export default FacesGame;
