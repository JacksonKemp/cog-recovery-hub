
import { useState } from "react";
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
import { Play, Check, X } from "lucide-react";

type Difficulty = "easy" | "medium" | "hard";
type GameState = "intro" | "instruction" | "recall" | "result";

interface InstructionTask {
  id: number;
  text: string;
  choices?: string[];
  correctAnswer: string;
}

interface GameConfig {
  instructions: number;
}

const difficultySettings: Record<Difficulty, GameConfig> = {
  easy: { instructions: 3 },
  medium: { instructions: 5 },
  hard: { instructions: 7 },
};

// Sample instruction templates
const instructionTemplates = [
  {
    text: "Remember to click the {color} button",
    variables: {
      color: ["red", "blue", "green", "yellow"]
    },
    choices: ["Red button", "Blue button", "Green button", "Yellow button"]
  },
  {
    text: "Count the number of {item}s, then select {action}",
    variables: {
      item: ["circle", "square", "triangle", "star"],
      action: ["the total", "one more than the total", "one less than the total"]
    },
    choices: ["1", "2", "3", "4", "5", "6"]
  },
  {
    text: "When asked about your favorite {category}, say {answer}",
    variables: {
      category: ["color", "animal", "food", "hobby"],
      answer: ["blue", "dog", "pizza", "reading"]
    },
    choices: ["Blue", "Dog", "Pizza", "Reading", "None of these"]
  },
  {
    text: "Remember the sequence: {sequence}",
    variables: {
      sequence: ["A, B, C, D", "1, 2, 3, 4", "circle, square, triangle", "red, blue, green, yellow"]
    },
    choices: ["A, B, C, D", "1, 2, 3, 4", "Circle, square, triangle", "Red, blue, green, yellow"]
  },
  {
    text: "After the tone, wait {time} seconds before clicking next",
    variables: {
      time: ["3", "5", "7", "10"]
    },
    choices: ["3 seconds", "5 seconds", "7 seconds", "10 seconds"]
  }
];

const TheWhatGame = () => {
  const [gameState, setGameState] = useState<GameState>("intro");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [instructions, setInstructions] = useState<InstructionTask[]>([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [gameConfig, setGameConfig] = useState<GameConfig>(difficultySettings.medium);
  
  // Handle difficulty change
  const handleDifficultyChange = (value: string) => {
    const newDifficulty = value as Difficulty;
    setDifficulty(newDifficulty);
    setGameConfig(difficultySettings[newDifficulty]);
  };
  
  // Generate random tasks based on templates
  const generateInstructions = (count: number): InstructionTask[] => {
    const generatedInstructions: InstructionTask[] = [];
    const shuffledTemplates = [...instructionTemplates].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < count; i++) {
      const templateIndex = i % shuffledTemplates.length;
      const template = shuffledTemplates[templateIndex];
      
      // Fill in variables
      let instructionText = template.text;
      let correctChoice = "";
      
      // Replace variables in the text
      Object.entries(template.variables).forEach(([varName, options]) => {
        const selectedOption = options[Math.floor(Math.random() * options.length)];
        instructionText = instructionText.replace(`{${varName}}`, selectedOption);
        
        // For some templates, the correct answer depends on the variable
        if (varName === "color" || varName === "answer" || varName === "sequence" || varName === "time") {
          correctChoice = selectedOption;
        }
      });
      
      // Some templates require special handling for correct answer
      if (instructionText.includes("click the")) {
        const color = instructionText.split("click the ")[1].split(" button")[0];
        correctChoice = color.charAt(0).toUpperCase() + color.slice(1) + " button";
      }
      
      // Create choices or use template choices
      const choices = template.choices ? [...template.choices] : undefined;
      
      generatedInstructions.push({
        id: i,
        text: instructionText,
        choices,
        correctAnswer: correctChoice
      });
    }
    
    return generatedInstructions;
  };
  
  // Start the game
  const startGame = () => {
    const newInstructions = generateInstructions(gameConfig.instructions);
    setInstructions(newInstructions);
    setCurrentInstructionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer("");
    setScore(0);
    setGameState("instruction");
  };
  
  // Move to the next instruction or to recall phase
  const nextInstruction = () => {
    if (currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
    } else {
      setCurrentInstructionIndex(0);
      setGameState("recall");
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  // Submit answer and move to next question
  const submitAnswer = () => {
    if (!selectedAnswer && instructions[currentInstructionIndex].choices) return;
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentInstructionIndex] = selectedAnswer;
    setUserAnswers(newUserAnswers);
    
    // Check if answer is correct
    if (selectedAnswer === instructions[currentInstructionIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    // Move to next question or end game
    if (currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
      setSelectedAnswer("");
    } else {
      setGameState("result");
    }
  };
  
  // Reset the game
  const resetGame = () => {
    setGameState("intro");
    setInstructions([]);
    setCurrentInstructionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer("");
    setScore(0);
  };
  
  return (
    <GameLayout title="The What Game">
      {gameState === "intro" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
          <p className="mb-6">
            Remember and recall instructions.
          </p>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <span>Difficulty:</span>
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
      
      {gameState === "instruction" && instructions.length > 0 && (
        <div className="text-center">
          <h2 className="text-xl mb-2">
            Remember This Instruction ({currentInstructionIndex + 1} of {instructions.length})
          </h2>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-xl font-medium mb-4">
                {instructions[currentInstructionIndex].text}
              </p>
            </CardContent>
          </Card>
          
          <Button onClick={nextInstruction}>
            {currentInstructionIndex < instructions.length - 1 ? "Next Instruction" : "Start Recall"}
          </Button>
        </div>
      )}
      
      {gameState === "recall" && instructions.length > 0 && (
        <div className="text-center">
          <h2 className="text-xl mb-4">
            Recall ({currentInstructionIndex + 1} of {instructions.length})
          </h2>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <p className="text-lg font-medium mb-4">
                What was the instruction about?
              </p>
              
              {instructions[currentInstructionIndex].choices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instructions[currentInstructionIndex].choices?.map((choice, index) => (
                    <Button 
                      key={index}
                      variant={selectedAnswer === choice ? "default" : "outline"}
                      onClick={() => handleAnswerSelect(choice)}
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="mb-4">
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Cancel
            </Button>
            <Button 
              onClick={submitAnswer}
              disabled={!selectedAnswer && instructions[currentInstructionIndex].choices !== undefined}
            >
              {currentInstructionIndex < instructions.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      )}
      
      {gameState === "result" && (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Results: {score} out of {instructions.length}
          </h2>
          
          <div className="flex justify-center mb-8">
            {score === instructions.length ? (
              <Check className="h-16 w-16 text-green-500" />
            ) : (
              <div className="text-4xl">
                {score / instructions.length >= 0.5 ? "🎉" : "🤔"}
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetGame}>
              Back
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

export default TheWhatGame;
