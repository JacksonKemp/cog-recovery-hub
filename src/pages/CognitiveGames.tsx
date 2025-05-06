import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Star, Clock, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const games = {
  memory: [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Match pairs of cards to test your visual memory",
      difficulty: "Easy",
      timeToComplete: "5 min",
      category: "Memory",
      icon: <Brain className="h-5 w-5" />,
      path: "/games/memory-match"
    },
    {
      id: "sequence-recall",
      title: "Sequence Recall",
      description: "Remember and repeat growing sequences of items",
      difficulty: "Medium",
      timeToComplete: "7 min",
      category: "Memory",
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: "word-pairs",
      title: "Word Pairs",
      description: "Memorize pairs of related words and recall them later",
      difficulty: "Hard",
      timeToComplete: "10 min",
      category: "Memory",
      icon: <Brain className="h-5 w-5" />
    }
  ],
  attention: [
    {
      id: "focus-finder",
      title: "Focus Finder",
      description: "Identify specific targets among distractions",
      difficulty: "Easy",
      timeToComplete: "5 min",
      category: "Attention",
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: "dual-task",
      title: "Dual Task Challenge",
      description: "Perform two different tasks simultaneously",
      difficulty: "Hard",
      timeToComplete: "8 min",
      category: "Attention",
      icon: <Brain className="h-5 w-5" />
    }
  ],
  processing: [
    {
      id: "quick-sort",
      title: "Quick Sort",
      description: "Sort items into categories as quickly as possible",
      difficulty: "Medium",
      timeToComplete: "6 min",
      category: "Processing Speed",
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: "reaction-time",
      title: "Reaction Time Test",
      description: "Test how quickly you can respond to visual stimuli",
      difficulty: "Easy",
      timeToComplete: "4 min",
      category: "Processing Speed",
      icon: <Brain className="h-5 w-5" />
    }
  ]
};

const GameCard = ({ game }: { game: any }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-cog-light-purple flex items-center justify-center">
            {game.icon}
          </div>
          <div className="flex items-center">
            <div className="bg-cog-soft-gray px-2 py-1 rounded text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1 text-cog-purple" />
              <span>{game.difficulty}</span>
            </div>
          </div>
        </div>
        <CardTitle className="text-lg">{game.title}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{game.timeToComplete}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild={!!game.path}>
          {game.path ? (
            <Link to={game.path}>Play Game</Link>
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
          <h1 className="text-3xl font-bold">Cognitive Games</h1>
          <p className="text-muted-foreground">Fun exercises to strengthen your cognitive abilities</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Today's Recommended Games
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
            {games.memory.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attention" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.attention.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="processing" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.processing.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 rounded-lg bg-cog-light-purple">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
            <p className="text-muted-foreground">
              Keep playing games regularly to see improvement in your cognitive abilities.
            </p>
          </div>
          <Button className="mt-4 md:mt-0">View Progress Stats</Button>
        </div>
      </div>
    </div>
  );
};

export default CognitiveGames;
