
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, CheckSquare, Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard = () => {
  // Mock data
  const recentActivities = [
    { id: 1, type: "game", name: "Memory Match", score: 85, date: "2 hours ago" },
    { id: 2, type: "task", name: "Doctor Appointment", completed: true, date: "Yesterday" },
    { id: 3, type: "symptom", name: "Headache", level: "Mild", date: "2 days ago" }
  ];

  const upcomingTasks = [
    { id: 1, name: "Take Medication", time: "Today, 8:00 PM" },
    { id: 2, name: "Physical Therapy", time: "Tomorrow, 10:00 AM" },
    { id: 3, name: "Cognitive Exercise", time: "Tomorrow, 3:00 PM" }
  ];

  const streakDays = 7;
  const completedGames = 12;
  const totalTasks = 15;
  const completedTasks = 10;
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-cog-purple mr-2" />
              <span className="text-2xl font-bold">{streakDays} days</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Games Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Brain className="h-4 w-4 text-cog-purple mr-2" />
              <span className="text-2xl font-bold">{completedGames}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Task Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <CheckSquare className="h-4 w-4 text-cog-purple mr-2" />
              <span className="text-2xl font-bold">{completedTasks}/{totalTasks}</span>
            </div>
            <Progress value={(completedTasks / totalTasks) * 100} className="h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Symptom Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-cog-purple mr-2" />
              <span className="text-2xl font-bold">Improving</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest games, tasks, and symptom logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center">
                    {activity.type === "game" && <Brain className="h-5 w-5 text-cog-purple mr-3" />}
                    {activity.type === "task" && <CheckSquare className="h-5 w-5 text-cog-purple mr-3" />}
                    {activity.type === "symptom" && <Activity className="h-5 w-5 text-cog-purple mr-3" />}
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.type === "game" && `Score: ${activity.score}%`}
                        {activity.type === "task" && (activity.completed ? "Completed" : "Pending")}
                        {activity.type === "symptom" && `Level: ${activity.level}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Tasks scheduled for today and tomorrow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-muted-foreground">{task.time}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link to="/games">
          <Card className="cursor-pointer hover:border-cog-purple transition-colors">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cog-light-purple flex items-center justify-center mr-4">
                  <Brain className="h-5 w-5 text-cog-purple" />
                </div>
                <h3 className="font-semibold">Cognitive Games</h3>
              </div>
              <ArrowRight className="h-5 w-5" />
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/tasks">
          <Card className="cursor-pointer hover:border-cog-purple transition-colors">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cog-light-purple flex items-center justify-center mr-4">
                  <CheckSquare className="h-5 w-5 text-cog-purple" />
                </div>
                <h3 className="font-semibold">Task Manager</h3>
              </div>
              <ArrowRight className="h-5 w-5" />
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/symptoms">
          <Card className="cursor-pointer hover:border-cog-purple transition-colors">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-cog-light-purple flex items-center justify-center mr-4">
                  <Activity className="h-5 w-5 text-cog-purple" />
                </div>
                <h3 className="font-semibold">Symptom Tracker</h3>
              </div>
              <ArrowRight className="h-5 w-5" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
