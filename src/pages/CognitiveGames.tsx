import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Star, Clock, BarChart3, Text, Circle, Square, BookOpen, Puzzle, Grid3X3, FileText, Search, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";

const exercises = {
  memory: [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Find matching pairs of cards in the shortest time",
      difficulty: "Easy",
      timeToComplete: "3 min",
      category: "Memory",
      icon: <Puzzle className="h-5 w-5" />,
      path: "/games/memory-match"
    },
    {
      id: "numbers",
      title: "Numbers Memory",
      description: "Remember and recall sequences of numbers",
      difficulty: "Medium",
      timeToComplete: "5 min",
      category: "Memory",
      icon: <Hash className="h-5 w-5" />,
      path: "/games/numbers"
    },
    {
      id: "names",
      title: "Names",
      description: "Remember a series of first and last names, then recall them",
      difficulty: "Hard",
      timeToComplete: "7 min",
      category: "Memory",
      icon: <BookOpen className="h-5 w-5" />,
      path: "/games/names"
    }
  ],
  attention: [
    {
      id: "faces",
      title: "Faces",
      description: "Match faces to the emotions they're expressing",
      difficulty: "Medium",
      timeToComplete: "5 min",
      category: "Attention",
      icon: <Circle className="h-5 w-5" />,
      path: "/games/faces"
    },
    {
      id: "rgb",
      title: "Red, Green, Blue",
      description: "Test your reflexes by tapping colored squares as prompted",
      difficulty: "Easy",
      timeToComplete: "3 min",
      category: "Attention",
      icon: <Square className="h-5 w-5" />,
      path: "/games/rgb"
    }
  ],
  processing: [
    {
      id: "word-finder",
      title: "Word Finder",
      description: "Find the different word in a group of similar words",
      difficulty: "Medium",
      timeToComplete: "6 min",
      category: "Attention",
      icon: <Text className="h-5 w-5" />,
      path: "/games/word-finder"
    },
    {
      id: "identification",
      title: "Identification",
      description: "Select options based on specific instructions",
      difficulty: "Easy",
      timeToComplete: "4 min",
      category: "Attention",
      icon: <Circle className="h-5 w-5" />,
      path: "/games/identification"
    }
  ],
  processingSpeed: [
    {
      id: "then-what",
      title: "Then What",
      description: "Remember and recall text and voice instructions",
      difficulty: "Hard",
      timeToComplete: "8 min",
      category: "Processing Speed",
      icon: <FileText className="h-5 w-5" />,
      path: "/games/then-what"
    },
    {
      id: "word-searches",
      title: "Word Searches",
      description: "Find hidden words in a grid of letters",
      difficulty: "Medium",
      timeToComplete: "7 min",
      category: "Processing Speed",
      icon: <Search className="h-5 w-5" />,
      path: "/games/word-searches"
    },
    {
      id: "sudoku",
      title: "Sudoku",
      description: "Fill in the grid so every row, column, and section contains digits 1-9",
      difficulty: "Hard",
      timeToComplete: "10 min",
      category: "Processing Speed",
      icon: <Grid3X3 className="h-5 w-5" />,
      path: "/games/sudoku"
    }
  ]
};

const ExerciseCard = ({ exercise, categoryKey }: { exercise: any; categoryKey: string }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-cog-light-teal flex items-center justify-center">
            {exercise.icon}
          </div>
          <div className="flex items-center">
            <div className="bg-cog-soft-gray px-2 py-1 rounded text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1 text-cog-teal" />
              <span>{exercise.difficulty}</span>
            </div>
          </div>
        </div>
        <CardTitle className="text-lg">{exercise.title}</CardTitle>
        <CardDescription>{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{exercise.timeToComplete}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild={!!exercise.path}>
          {exercise.path ? (
            <Link to={exercise.path}>Launch</Link>
          ) : (
            "Coming Soon"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const CognitiveGames = () => {
  const [selectedCategory, setSelectedCategory] = useState("memory");
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Cognitive Exercises</h1>
          <p className="text-muted-foreground">Fun exercises to strengthen your cognitive abilities</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <Link to="/games/progress">
              <BarChart3 className="h-4 w-4" />
              View Progress
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="memory" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="attention">Attention</TabsTrigger>
          <TabsTrigger value="processing">Processing Speed</TabsTrigger>
        </TabsList>

        <TabsContent value="memory" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.memory.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} categoryKey="memory" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attention" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.attention.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} categoryKey="attention" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="processing" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.processing.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} categoryKey="processing" />
            ))}
            {exercises.processingSpeed.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} categoryKey="processing" />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 rounded-lg bg-cog-light-teal">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p className="text-muted-foreground">
              Keep playing exercises regularly to see improvement in your cognitive abilities.
            </p>
          </div>
          <Button className="mt-4 md:mt-0" asChild>
            <Link to="/games/progress">View Progress Stats</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CognitiveGames;
