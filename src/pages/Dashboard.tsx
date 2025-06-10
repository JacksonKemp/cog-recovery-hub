import { format, isSameDay } from "date-fns";
import { CalendarIcon, Clock, Brain, ChevronRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { cn } from "@/lib/utils";
import { getExerciseRoute } from "@/utils/exerciseRecommendations";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/utils/taskUtils";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, isLoading } = useTasks();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container py-4 md:py-8">
        <div className="text-center py-10 md:py-12 text-muted-foreground">
          Please log in to view your dashboard.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-4 md:py-8">
        <div className="text-center py-10 md:py-12 text-muted-foreground">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  // Get today's and tomorrow's tasks for the schedule
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayTasks = tasks.filter(task => 
    isSameDay(task.date, today) && !task.completed
  ).slice(0, 3);
  
  const tomorrowTasks = tasks.filter(task => 
    isSameDay(task.date, tomorrow) && !task.completed
  ).slice(0, 2);
  
  const scheduleTasks = [...todayTasks, ...tomorrowTasks].slice(0, 5);

  // Handle task click - navigate to game if it's an exercise
  const handleTaskClick = (task: Task) => {
    const gameRoute = getExerciseRoute(task.title);
    if (gameRoute) {
      navigate(gameRoute);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">5 Tasks</p>
              <p className="text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scheduleTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming tasks
                </p>
              ) : (
                scheduleTasks.map((task) => {
                  const isExercise = getExerciseRoute(task.title);
                  const isToday = isSameDay(task.date, today);
                  
                  return (
                    <div 
                      key={task.id} 
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-colors",
                        isExercise ? "hover:bg-cog-light-teal cursor-pointer border-cog-teal/20" : "bg-muted/30"
                      )}
                      onClick={() => isExercise && handleTaskClick(task)}
                    >
                      <div className="flex items-center gap-3">
                        {isExercise ? (
                          <Brain className="h-4 w-4 text-cog-teal" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {isToday ? 'Today' : 'Tomorrow'} at {format(task.date, 'h:mm a')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          Difficulty: {task.difficulty}
                        </span>
                        {isExercise && (
                          <ChevronRight className="h-4 w-4 text-cog-teal" />
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent activity</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="bg-white py-4 text-center text-muted-foreground">
        <p>
          {new Date().getFullYear()} Cognitive Rehabilitation Assistant. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
}
