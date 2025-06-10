import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, Timer, Brain } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { saveGameProgress } from "@/services/gameService";
import { useAuth } from "@/hooks/use-auth";

type Card = {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
};

const GAME_ICONS = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍋", "🍒", "🥥", "🍍", "🥝", "🥭", "🍑"];

const MemoryMatch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [score, setScore] = useState<number>(0);
  
  const getDifficultyConfig = () => {
    switch(difficulty) {
      case "easy": 
        return { pairs: 6, timeLimit: 120 };
      case "medium": 
        return { pairs: 8, timeLimit: 90 };
      case "hard": 
        return { pairs: 12, timeLimit: 60 };
      default:
        return { pairs: 6, timeLimit: 120 };
    }
  };

  const config = getDifficultyConfig();
  
  const initializeGame = () => {
    const selectedIcons = GAME_ICONS.slice(0, config.pairs);
    
    let initialCards = selectedIcons.flatMap((icon, index) => [
      { id: index * 2, icon, flipped: false, matched: false },
      { id: index * 2 + 1, icon, flipped: false, matched: false }
    ]);
    
    initialCards = initialCards.sort(() => Math.random() - 0.5);
    
    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameCompleted(false);
    setScore(0);
  };

  const startGame = () => {
    initializeGame();
    setGameStarted(true);
  };

  const handleCardFlip = (id: number) => {
    if (flippedCards.length === 2 || cards.find(card => card.id === id)?.matched) return;
    
    if (flippedCards.includes(id)) return;
    
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    ));
    
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const firstCard = cards.find(card => card.id === newFlippedCards[0]);
      const secondCard = cards.find(card => card.id === newFlippedCards[1]);
      
      if (firstCard?.icon === secondCard?.icon) {
        setTimeout(() => {
          setCards(cards.map(card => 
            newFlippedCards.includes(card.id) ? { ...card, matched: true } : card
          ));
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
          
          const timeBonus = Math.max(1, Math.floor((config.timeLimit - timeElapsed) / 10));
          const newPoints = 100 + (timeBonus * 10);
          setScore(score + newPoints);
          
          if (matchedPairs + 1 === config.pairs) {
            handleGameCompletion();
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(cards.map(card => 
            newFlippedCards.includes(card.id) ? { ...card, flipped: false } : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleGameCompletion = async () => {
    setGameCompleted(true);
    
    const difficultyMultiplier = difficulty === "easy" ? 1 : difficulty === "medium" ? 1.5 : 2;
    const timeBonus = Math.max(0, config.timeLimit - timeElapsed);
    const movesEfficiency = Math.max(0, config.pairs * 4 - moves);
    const finalScore = Math.round((score + (timeBonus * 5) + (movesEfficiency * 10)) * difficultyMultiplier);
    
    setScore(finalScore);
    toast.success(`Exercise completed! Final Score: ${finalScore}`);
    
    if (!user) {
      toast.error("You need to be logged in to save your progress");
      return;
    }
    
    try {
      console.log("Attempting to save exercise progress...");
      const progressId = await saveGameProgress(
        "memory-match",
        "memory",
        finalScore,
        undefined,
        undefined,
        timeElapsed
      );
      
      console.log("Exercise progress saved with ID:", progressId);
    } catch (error) {
      console.error('Error saving exercise progress:', error);
      toast.error("Failed to save exercise progress");
    }
  };

  useEffect(() => {
    let interval: number | undefined;
    
    if (gameStarted && !gameCompleted) {
      interval = window.setInterval(() => {
        setTimeElapsed(prevTime => {
          const newTime = prevTime + 1;
          
          if (newTime >= config.timeLimit) {
            clearInterval(interval);
            toast.error("Time's up!");
            setGameCompleted(true);
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameCompleted, config.timeLimit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/games')}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Exercises
        </Button>
      </div>
      
      {!gameStarted ? (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          <div className="w-16 h-16 rounded-full bg-cog-light-teal flex items-center justify-center mb-6 mx-auto">
            <Brain className="h-8 w-8 text-cog-teal" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Memory Match</h2>
          <p className="text-muted-foreground mb-6">
            Test your visual memory by finding matching pairs of cards. The faster you match, the more points you earn!
          </p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select Difficulty:</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant={difficulty === "easy" ? "default" : "outline"} 
                onClick={() => setDifficulty("easy")}
                className="flex-1 text-sm"
              >
                Easy (6 pairs)
              </Button>
              <Button 
                variant={difficulty === "medium" ? "default" : "outline"} 
                onClick={() => setDifficulty("medium")}
                className="flex-1 text-sm"
              >
                Medium (8 pairs)
              </Button>
              <Button 
                variant={difficulty === "hard" ? "default" : "outline"} 
                onClick={() => setDifficulty("hard")}
                className="flex-1 text-sm"
              >
                Hard (12 pairs)
              </Button>
            </div>
          </div>
          
          <Button className="w-full" onClick={startGame}>Start Exercise</Button>
        </div>
      ) : (
        <div className="mb-12">
          {gameCompleted && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="flex gap-4 mb-4 md:mb-0">
                <div className="bg-cog-soft-gray p-3 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Time</div>
                  <div className="text-xl font-bold flex items-center">
                    <Timer className="h-4 w-4 mr-1" />
                    {formatTime(timeElapsed)} / {formatTime(config.timeLimit)}
                  </div>
                </div>
                
                <div className="bg-cog-soft-gray p-3 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Moves</div>
                  <div className="text-xl font-bold">{moves}</div>
                </div>
                
                <div className="bg-cog-soft-gray p-3 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Score</div>
                  <div className="text-xl font-bold">{score}</div>
                </div>
              </div>
              
              <Badge variant="outline" className="text-lg px-3 py-1">
                {difficulty === "easy" ? "Easy" : difficulty === "medium" ? "Medium" : "Hard"}
              </Badge>
            </div>
          )}
          
          {gameCompleted ? (
            <div className="text-center p-8 bg-cog-light-teal rounded-lg shadow-md">
              <Trophy className="h-16 w-16 text-cog-teal mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Exercise Completed!</h2>
              <p className="text-lg mb-4">Final Score: {score}</p>
              <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                <Button onClick={() => {
                  setGameStarted(false);
                }}>
                  Play Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/exercises')}>
                  Back to Exercises
                </Button>
              </div>
            </div>
          ) : (
            <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4`}>
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => !card.flipped && !gameCompleted && !card.matched && handleCardFlip(card.id)}
                  className={`aspect-square rounded-lg transition-all duration-300 transform ${
                    card.matched ? 'opacity-0 pointer-events-none' : 'cursor-pointer'
                  } ${card.flipped ? 'rotate-y-180' : ''}`}
                  style={{ perspective: '1000px' }}
                >
                  {!card.matched && (
                    <div 
                      className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                        card.flipped ? 'rotate-y-180' : ''
                      }`}
                    >
                      <div 
                        className={`absolute w-full h-full backface-hidden rounded-lg ${
                          card.flipped ? 'hidden' : 'flex'
                        } items-center justify-center bg-cog-teal text-white font-bold text-xl`}
                      >
                        <span>?</span>
                      </div>
                      
                      <div 
                        className={`absolute w-full h-full backface-hidden rounded-lg ${
                          card.flipped ? 'flex' : 'hidden'
                        } rotate-y-180 items-center justify-center bg-white border-2 border-gray-200 text-4xl`}
                      >
                        {card.icon}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoryMatch;
