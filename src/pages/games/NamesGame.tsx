import { useState, useEffect } from "react";
import GameLayout from "@/components/games/GameLayout";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Play, Timer, Check, X } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "memorize" | "wait" | "recall" | "result";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
}

interface GameConfig {
  namesCount: number;
  memorizeTime: number;
  waitTime: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { namesCount: 3, memorizeTime: 12, waitTime: 15 },
  medium: { namesCount: 5, memorizeTime: 15, waitTime: 15 },
  hard: { namesCount: 7, memorizeTime: 20, waitTime: 15 },
};

// Sample names for demonstration
const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

const NamesGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [people, setPeople] = useState<Person[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: {firstName: string, lastName: string}}>({});
  const [score, setScore] = useState<{correct: number, total: number}>({ correct: 0, total: 0 });
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Generate random names based on difficulty
  const generatePeople = (count: number): Person[] => {
    const newPeople: Person[] = [];
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      newPeople.push({
        id: i + 1,
        firstName,
        lastName
      });
    }
    
    return newPeople;
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Start the game
  const startGame = () => {
    const newPeople = generatePeople(gameConfig.namesCount);
    setPeople(newPeople);
    setTimeLeft(gameConfig.memorizeTime);
    setGameState("memorize");
    setUserAnswers({});
    setScore({ correct: 0, total: 0 });
  };
  
  // Timer effect
  useEffect(() => {
    if ((gameState === "memorize" || gameState === "wait") && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      if (gameState === "memorize") {
        setGameState("wait");
        setTimeLeft(gameConfig.waitTime);
      } else if (gameState === "wait") {
        setGameState("recall");
      }
    }
  }, [timeLeft, gameState, gameConfig.waitTime]);
  
  // Handle input change for recall phase
  const handleInputChange = (personId: number, field: 'firstName' | 'lastName', value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [personId]: {
        ...prev[personId],
        [field]: value
      }
    }));
  };
  
  // Check answers
  const checkAnswers = () => {
    let correctCount = 0;
    
    people.forEach(person => {
      const userAnswer = userAnswers[person.id] || { firstName: '', lastName: '' };
      
      if (
        userAnswer.firstName?.toLowerCase() === person.firstName.toLowerCase() &&
        userAnswer.lastName?.toLowerCase() === person.lastName.toLowerCase()
      ) {
        correctCount++;
      }
    });
    
    setScore({
      correct: correctCount,
      total: people.length
    });
    
    setGameState("result");
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setPeople([]);
    setUserAnswers({});
    setScore({ correct: 0, total: 0 });
  };
  
  return (
    <GameLayout title="Names Memory Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Memorize the names shown briefly, then recall them correctly after a waiting period.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Select difficulty:</span>
              <Select value={difficulty} onValueChange={handleDifficultyChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={startGame} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Game
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "memorize" && (
        <div className="text-center">
          <h2 className="text-xl mb-2">Memorize these names</h2>
          <p className="text-muted-foreground mb-6">Time left: {timeLeft} seconds</p>
          
          <div className="grid gap-4 mb-6 max-w-md mx-auto">
            {people.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4 flex items-center justify-center">
                  <div className="mr-4 bg-muted h-12 w-12 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{person.firstName} {person.lastName}</div>
                    <div className="text-sm text-muted-foreground">Person #{person.id}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Timer className="h-6 w-6 animate-pulse text-primary" />
          </div>
        </div>
      )}
      
      {gameState === "wait" && (
        <div className="text-center">
          <h2 className="text-xl mb-6">Wait for {timeLeft} seconds...</h2>
          <p className="text-4xl mb-8">🧠</p>
          <p className="text-muted-foreground">Try to keep the names in your memory</p>
        </div>
      )}
      
      {gameState === "recall" && (
        <div className="text-center">
          <h2 className="text-xl mb-6">Enter the names you memorized</h2>
          
          <div className="grid gap-6 mb-8 max-w-md mx-auto">
            {people.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4">
                  <div className="text-sm font-medium mb-2">Person #{person.id}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text"
                      placeholder="First Name"
                      className="px-3 py-2 border rounded-md"
                      value={userAnswers[person.id]?.firstName || ''}
                      onChange={(e) => handleInputChange(person.id, 'firstName', e.target.value)}
                    />
                    <input 
                      type="text"
                      placeholder="Last Name"
                      className="px-3 py-2 border rounded-md"
                      value={userAnswers[person.id]?.lastName || ''}
                      onChange={(e) => handleInputChange(person.id, 'lastName', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Cancel
            </Button>
            <Button 
              onClick={checkAnswers} 
              disabled={Object.keys(userAnswers).length === 0}
            >
              Check Answers
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Results: {score.correct} out of {score.total}
          </h2>
          
          <div className="flex justify-center mb-8">
            {score.correct === score.total ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <div className="text-4xl">
                {score.correct / score.total >= 0.5 ? "🎉" : "🤔"}
              </div>
            )}
          </div>
          
          <div className="space-y-4 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-medium">Correct Answers:</h3>
            {people.map((person) => {
              const userAnswer = userAnswers[person.id] || { firstName: '', lastName: '' };
              const isFirstNameCorrect = userAnswer.firstName?.toLowerCase() === person.firstName.toLowerCase();
              const isLastNameCorrect = userAnswer.lastName?.toLowerCase() === person.lastName.toLowerCase();
              
              return (
                <div key={person.id} className="border rounded-md p-3">
                  <div className="font-medium">Person #{person.id}</div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <div className="text-xs text-muted-foreground">First Name</div>
                      <div className="flex justify-between items-center">
                        <span className={isFirstNameCorrect ? "text-green-600" : "text-red-600"}>
                          {person.firstName}
                        </span>
                        {isFirstNameCorrect ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <X className="h-4 w-4 text-red-500" />
                        }
                      </div>
                      {!isFirstNameCorrect && (
                        <div className="text-xs text-muted-foreground">
                          Your answer: {userAnswer.firstName || "(blank)"}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground">Last Name</div>
                      <div className="flex justify-between items-center">
                        <span className={isLastNameCorrect ? "text-green-600" : "text-red-600"}>
                          {person.lastName}
                        </span>
                        {isLastNameCorrect ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <X className="h-4 w-4 text-red-500" />
                        }
                      </div>
                      {!isLastNameCorrect && (
                        <div className="text-xs text-muted-foreground">
                          Your answer: {userAnswer.lastName || "(blank)"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => setGameState("intro")}>
              Back to Instructions
            </Button>
            <Button onClick={startGame}>
              Play Again
            </Button>
          </div>
        </div>
      )}
    </GameLayout>
  );
};

export default NamesGame;
