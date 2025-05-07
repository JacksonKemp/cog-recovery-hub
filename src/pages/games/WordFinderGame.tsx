
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";

const WordFinderGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  return (
    <GameLayout title="Word Finder Game">
      {gameState === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Find the word that is different in a group of similar words.
            Test your attention to detail and pattern recognition.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Game Rules</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>You will be shown a group of similar words</li>
              <li>One word will be different - either in spelling, meaning, or category</li>
              <li>Select the word that doesn't belong as quickly as possible</li>
              <li>Complete as many rounds as you can within the time limit</li>
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

export default WordFinderGame;
