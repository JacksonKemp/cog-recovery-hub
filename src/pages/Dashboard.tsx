
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, CheckSquare, Clock, ArrowRight, Calendar, MessageSquare, Plus, Dumbbell } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getDashboardStats, DashboardStats } from "@/services/dashboardService";
import { getPractitionerMessage, PractitionerMessage } from "@/services/practitionerMessageService";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { format, isSameDay, isToday, isTomorrow } from "date-fns";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ streakDays: 0, completedGames: 0 });
  const [practitionerMessage, setPractitionerMessage] = useState<PractitionerMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { tasks, isLoading: tasksLoading } = useTasks();
  
  // Get user's first name from full_name or email
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Helper function to extract exercise info from task title and difficulty
  const getExerciseInfo = (title: string, taskDifficulty: number) => {
    const lowerTitle = title.toLowerCase();
    
    // Convert numeric difficulty to string, with better mapping
    let difficulty = "easy"; // default
    if (taskDifficulty >= 5) {
      difficulty = "hard";
    } else if (taskDifficulty >= 4) {
      difficulty = "medium";
    }
    
    // Also check title for explicit difficulty mentions (fallback)
    if (lowerTitle.includes("hard")) difficulty = "hard";
    else if (lowerTitle.includes("medium")) difficulty = "medium";
    else if (lowerTitle.includes("easy")) difficulty = "easy";
    
    // Map exercise types to routes
    const exerciseMap = {
      "memory match": "/games/memory-match",
      "number recall": "/games/numbers",
      "numbers game": "/games/numbers", 
      "numbers": "/games/numbers",
      "word finder": "/games/word-finder",
      "rgb": "/games/rgb",
      "faces": "/games/faces",
      "identification": "/games/identification", 
      "names": "/games/names",
      "then what": "/games/then-what"
    };
    
    for (const [exercise, path] of Object.entries(exerciseMap)) {
      if (lowerTitle.includes(exercise)) {
        return { path: `${path}?difficulty=${difficulty}`, difficulty };
      }
    }
    
    return null;
  };

  // Get today's and tomorrow's tasks for the schedule
  const getUpcomingTasks = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks
      .filter(task => !task.completed && (isToday(task.date) || isTomorrow(task.date)))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5) // Limit to 5 items for display
      .map(task => {
        const exerciseInfo = getExerciseInfo(task.title, task.difficulty);
        
        // Check if task has a specific time (not just a date)
        const hasSpecificTime = task.date.getHours() !== 0 || task.date.getMinutes() !== 0;
        
        return {
          id: task.id,
          name: task.title,
          time: isToday(task.date) 
            ? hasSpecificTime 
              ? `Today, ${format(task.date, 'h:mm a')}`
              : "Today"
            : hasSpecificTime
              ? `Tomorrow, ${format(task.date, 'h:mm a')}`
              : "Tomorrow",
          type: exerciseInfo ? "exercise" : "task",
          path: exerciseInfo?.path,
          difficulty: exerciseInfo?.difficulty
        };
      });
  };

  const upcomingTasks = getUpcomingTasks();

  // Load dashboard stats and practitioner message when user is available
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
      
      // Generate a practitioner message
      const message = getPractitionerMessage();
      setPractitionerMessage(message);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to render task items with optional links for games
  const renderTaskItem = (task) => {
    const content = (
      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-center">
          {task.type === "exercise" ? (
            <Brain className="h-4 w-4 text-cog-teal mr-3" />
          ) : (
            <CheckSquare className="h-4 w-4 text-cog-teal mr-3" />
          )}
          <div>
            <p className="font-medium">{task.name}</p>
            {task.difficulty && (
              <p className="text-xs text-muted-foreground capitalize">
                Difficulty: {task.difficulty}
              </p>
            )}
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{task.time}</span>
      </div>
    );
    
    return task.path ? (
      <Link key={task.id} to={task.path} className="block">
        {content}
      </Link>
    ) : (
      <div key={task.id}>{content}</div>
    );
  };
  
  return (
    <div className="container py-8">
      {/* Streak and Exercises - Small Stats at Top */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Hello, {getUserDisplayName()}</h1>
        <div className="flex gap-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-cog-teal mr-2" />
            <div>
              <span className="text-sm text-muted-foreground">Streak</span>
              <p className="font-semibold">
                {isLoading ? "..." : `${stats.streakDays} days`}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-cog-teal mr-2" />
            <div>
              <span className="text-sm text-muted-foreground">Exercises</span>
              <p className="font-semibold">
                {isLoading ? "..." : `${stats.completedGames} completed`}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Exercise Widget - Floating button */}
      <div className="fixed bottom-20 right-6 z-10 md:bottom-24 md:right-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-lg bg-cog-teal hover:bg-cog-teal/90 touch-action-manipulation"
            >
              <Dumbbell className="h-6 w-6" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-64 p-0">
            <Link to="/games" className="block">
              <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors rounded-t-md">
                <div className="bg-cog-light-teal p-2 rounded-full">
                  <Brain className="h-5 w-5 text-cog-teal" />
                </div>
                <div>
                  <p className="font-medium">Cognitive Exercises</p>
                  <p className="text-xs text-muted-foreground">Train your brain</p>
                </div>
              </div>
            </Link>
            <Link to="/tasks" className="block">
              <div className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-t">
                <div className="bg-cog-light-teal p-2 rounded-full">
                  <CheckSquare className="h-5 w-5 text-cog-teal" />
                </div>
                <div>
                  <p className="font-medium">Task Manager</p>
                  <p className="text-xs text-muted-foreground">Track your activities</p>
                </div>
              </div>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Main Content - Simplified Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptom Trend with Track Today's Symptoms */}
        <Card className="hover:border-cog-teal transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cog-teal" />
              Symptom Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-2xl font-bold text-cog-teal mb-2">Improving</div>
              <div className="text-muted-foreground text-sm mb-6">
                Your symptoms have decreased by 15% this week
              </div>
              
              {/* Track Today's Symptoms button inside the card */}
              <Link to="/symptoms" className="w-full">
                <div className="bg-cog-light-teal rounded-lg hover:border hover:border-cog-teal transition-all duration-300 p-4 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3">
                    <Plus className="h-5 w-5 text-cog-teal" />
                  </div>
                  <span className="font-semibold">Track Today's Symptoms</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Today's Schedule */}
        <Card className="hover:border-cog-teal transition-all duration-300 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cog-teal" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="text-center py-6 text-muted-foreground">
                Loading your schedule...
              </div>
            ) : upcomingTasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No upcoming tasks. <Link to="/tasks" className="text-cog-teal hover:underline">Add some tasks</Link> to see them here.
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => renderTaskItem(task))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* AI-Generated Message from Practitioner */}
        <Card className="hover:border-cog-teal transition-all duration-300 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cog-teal" />
              <CardTitle>{practitionerMessage?.title || "Message from your Occupational Therapist"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm mb-2">
                {practitionerMessage?.message || "Loading personalized guidance..."}
              </p>
              <p className="text-xs text-muted-foreground">
                {practitionerMessage?.timestamp ? 
                  `Generated ${practitionerMessage.timestamp.toLocaleDateString()}` : 
                  "Loading..."
                }
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                size="sm" 
                variant="outline"
                onClick={loadDashboardData}
              >
                Get New Tip
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
