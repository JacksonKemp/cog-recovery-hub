
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, CheckSquare, Clock, ArrowRight, Calendar, MessageSquare, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data
  const streakDays = 7;
  const completedGames = 12;
  
  const upcomingTasks = [
    { id: 1, name: "Take Medication", time: "Today, 8:00 PM" },
    { id: 2, name: "Physical Therapy", time: "Tomorrow, 10:00 AM" },
    { id: 3, name: "Memory Match Game", time: "Today, 3:00 PM", type: "exercise", path: "/games/memory-match" }
  ];
  
  const hasLoggedSymptomsToday = false;
  
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
      {/* Streak and Games - Small Stats at Top */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Hello, Sam</h1>
        <div className="flex gap-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-cog-teal mr-2" />
            <div>
              <span className="text-sm text-muted-foreground">Streak</span>
              <p className="font-semibold">{streakDays} days</p>
            </div>
          </div>
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-cog-teal mr-2" />
            <div>
              <span className="text-sm text-muted-foreground">Games</span>
              <p className="font-semibold">{completedGames} completed</p>
            </div>
          </div>
        </div>
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
        
        {/* Message from Practitioner */}
        <Card className="hover:border-cog-teal transition-all duration-300 md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cog-teal" />
              Message from Dr. Johnson
            </CardTitle>
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
