
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
    { id: 3, name: "Memory Match Game", time: "Today, 3:00 PM", type: "exercise" }
  ];
  
  const hasLoggedSymptomsToday = false;
  
  return (
    <div className="container py-8">
      {/* Streak and Games - Small Stats at Top */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Hello, Sam</h1>
        <div className="flex gap-6">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-cog-purple mr-2" />
            <div>
              <span className="text-sm text-muted-foreground">Streak</span>
              <p className="font-semibold">{streakDays} days</p>
            </div>
          </div>
          <div className="flex items-center">
            <Brain className="h-5 w-5 text-cog-purple mr-2" />
            <div>
              <span className="text-sm text-muted-foreground">Games</span>
              <p className="font-semibold">{completedGames} completed</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content - Simplified Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptom Trend */}
        <Card className="hover:border-cog-purple transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cog-purple" />
              Symptom Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-2xl font-bold text-cog-purple mb-2">Improving</div>
              <div className="text-muted-foreground text-sm">
                Your symptoms have decreased by 15% this week
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Track Today's Symptoms */}
        {!hasLoggedSymptomsToday && (
          <Link to="/symptoms">
            <Card className="bg-cog-soft-blue hover:border-cog-purple transition-all duration-300 h-full">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="w-12 h-12 rounded-full bg-cog-light-purple flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-cog-purple" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Track Today's Symptoms</h3>
                <p className="text-center text-muted-foreground text-sm">
                  Keep track of how you're feeling today
                </p>
              </CardContent>
            </Card>
          </Link>
        )}
        
        {/* Today's Schedule */}
        <Link to="/tasks">
          <Card className="hover:border-cog-purple transition-all duration-300 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cog-purple" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center">
                      {task.type === "exercise" ? (
                        <Brain className="h-4 w-4 text-cog-purple mr-3" />
                      ) : (
                        <CheckSquare className="h-4 w-4 text-cog-purple mr-3" />
                      )}
                      <p className="font-medium">{task.name}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{task.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Link>
        
        {/* Message from Practitioner */}
        <Card className="hover:border-cog-purple transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-cog-purple" />
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
