
import { useState } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";

const WordSearchesGame = () => {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  
  return (
    <GameLayout title="Word Searches Game">
      {gameState === 'intro' && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Find hidden words in a grid of letters. Words can be placed horizontally, 
            vertically, or diagonally, and can read forwards or backwards.
          </p>
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Game Rules</h3>
            <ul className="space-y-2 max-w-md mx-auto text-left">
              <li>You will be given a list of words to find in the grid</li>
              <li>Select letters by dragging from the first letter to the last</li>
              <li>Found words will be crossed off the list</li>
              <li>Complete the puzzle by finding all words as quickly as possible</li>
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

export default WordSearchesGame;
