
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Clock, Calendar, Plus, Trash2, CheckCircle, Circle } from "lucide-react";

// Task type definition
type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  category: string;
  priority: "low" | "medium" | "high";
};

const TaskManager = () => {
  const [newTask, setNewTask] = useState("");
  // Sample tasks
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Take medication", 
      completed: false, 
      date: "Today, 8:00 PM", 
      category: "health",
      priority: "high" 
    },
    { 
      id: "2", 
      title: "Doctor appointment", 
      completed: false, 
      date: "Tomorrow, 2:00 PM", 
      category: "health",
      priority: "medium" 
    },
    { 
      id: "3", 
      title: "Complete memory exercises", 
      completed: true, 
      date: "Today", 
      category: "rehabilitation",
      priority: "medium" 
    },
    { 
      id: "4", 
      title: "Call family member", 
      completed: false, 
      date: "Today", 
      category: "personal",
      priority: "low" 
    },
    { 
      id: "5", 
      title: "Grocery shopping", 
      completed: false, 
      date: "This week", 
      category: "personal",
      priority: "medium" 
    },
  ]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        date: "Today",
        category: "personal",
        priority: "medium",
      };
      setTasks([task, ...tasks]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-muted-foreground">Organize your daily activities</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
          <CardDescription>Create a new task to keep track of your activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTask();
              }}
            />
            <Button onClick={handleAddTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No pending tasks. Add a new task to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="mr-3 text-muted-foreground hover:text-foreground"
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        <Circle className="h-5 w-5" />
                      </button>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{task.date}</span>
                          
                          <span className="mx-2">•</span>
                          
                          <div className={`
                            px-1.5 py-0.5 rounded text-xs
                            ${task.priority === "high" ? "bg-red-100 text-red-700" : 
                              task.priority === "medium" ? "bg-amber-100 text-amber-700" : 
                              "bg-green-100 text-green-700"}
                          `}>
                            {task.priority}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {completedTasks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No completed tasks yet.
            </div>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="bg-muted/40">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        className="mr-3 text-cog-purple"
                        onClick={() => toggleTaskCompletion(task.id)}
                      >
                        <CheckCircle className="h-5 w-5" fill="currentColor" />
                      </button>
                      <div>
                        <p className="font-medium line-through">{task.title}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{task.date}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-6 rounded-lg bg-cog-light-purple">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-cog-purple" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Task Completion Tips</h3>
            <p className="text-muted-foreground max-w-xl">
              Break down large tasks into smaller steps. Set reminders for important tasks. 
              Celebrate your progress when you complete tasks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
