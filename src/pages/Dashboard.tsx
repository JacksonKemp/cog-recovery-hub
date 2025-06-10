import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, CheckSquare, Clock, ArrowRight, Calendar, MessageSquare, Plus, Dumbbell } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getDashboardStats, DashboardStats } from "@/services/dashboardService";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ streakDays: 0, completedGames: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
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
  
  const upcomingTasks = [
    { id: 1, name: "Take Medication", time: "Today, 8:00 PM" },
    { id: 2, name: "Physical Therapy", time: "Tomorrow, 10:00 AM" },
    { id: 3, name: "Memory Match Game", time: "Today, 3:00 PM", type: "exercise", path: "/games/memory-match" }
  ];
  
  const hasLoggedSymptomsToday = false;
  
  // Recommended exercises
  const recommendedExercises = [
    { id: 1, name: "Memory Match", description: "Train your visual memory", path: "/games/memory-match", icon: Brain },
    { id: 2, name: "Number Recall", description: "Improve number retention", path: "/games/numbers", icon: Brain },
    { id: 3, name: "Word Finder", description: "Enhance vocabulary skills", path: "/games/word-finder", icon: Brain }
  ];

  // Load dashboard stats when user is available
  useEffect(() => {
    if (user) {
      loadDashboardStats();
    }
  }, [user]);

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
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
          <p className="font-medium">{task.name}</p>
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
            <div className="space-y-4">
              {upcomingTasks.map((task) => renderTaskItem(task))}
            </div>
          </CardContent>
        </Card>
        
        {/* Daily Exercises Widget - ADDED HERE */}
        <Card className="hover:border-cog-teal transition-all duration-300 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-cog-teal" />
              Daily Exercises
            </CardTitle>
            <CardDescription>Recommended activities for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedExercises.map((exercise) => (
                <Link key={exercise.id} to={exercise.path} className="block">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <div className="bg-cog-light-teal p-2 rounded-full mr-3">
                        <exercise.icon className="h-4 w-4 text-cog-teal" />
                      </div>
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">{exercise.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/games">
                <Button variant="outline" className="w-full">
                  View All Exercises
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Message from Practitioner */}
        <Card className="hover:border-cog-teal transition-all duration-300 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cog-teal" />
              <CardTitle>Message from Dr. Johnson</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm mb-2">
                "Great progress with your memory exercises this week! Let's review your symptom trends in our next appointment."
              </p>
              <p className="text-xs text-muted-foreground">Received yesterday</p>
            </div>
            <div className="mt-4 flex justify-end">
              <Button size="sm" variant="outline">
                Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
