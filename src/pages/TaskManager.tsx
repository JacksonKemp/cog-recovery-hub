
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  CheckSquare, 
  Trash2, 
  CheckCircle, 
  Circle, 
  CalendarIcon, 
  MoveHorizontal,
  Plus,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Task type definition
type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: Date;
  category: string;
  difficulty: number; // 1-10 score
};

// Helper function to get day name
const getDayName = (date: Date) => {
  return format(date, 'EEEE');
};

// Helper to calculate total difficulty for a day
const calculateDayDifficulty = (tasks: Task[], date: Date) => {
  return tasks
    .filter(task => isSameDay(task.date, date) && !task.completed)
    .reduce((sum, task) => sum + task.difficulty, 0);
};

const TaskManager = () => {
  const [newTask, setNewTask] = useState("");
  const [newDifficulty, setNewDifficulty] = useState<number>(5);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTaskCategory, setNewTaskCategory] = useState<string>("personal");
  const [showCompleted, setShowCompleted] = useState(false);
  
  // Sample tasks with dates as Date objects and difficulty scores
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Take medication", 
      completed: false, 
      date: new Date(), 
      category: "health",
      difficulty: 2
    },
    { 
      id: "2", 
      title: "Doctor appointment", 
      completed: false, 
      date: addDays(new Date(), 1), 
      category: "health",
      difficulty: 5
    },
    { 
      id: "3", 
      title: "Complete memory exercises", 
      completed: true, 
      date: new Date(), 
      category: "rehabilitation",
      difficulty: 7
    },
    { 
      id: "4", 
      title: "Call family member", 
      completed: false, 
      date: new Date(), 
      category: "personal",
      difficulty: 3
    },
    { 
      id: "5", 
      title: "Grocery shopping", 
      completed: false, 
      date: addDays(new Date(), 3), 
      category: "personal",
      difficulty: 6
    },
  ]);

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        date: selectedDate,
        category: newTaskCategory,
        difficulty: newDifficulty,
      };
      setTasks([task, ...tasks]);
      setNewTask("");
      setNewDifficulty(5); // Reset to default
      setNewTaskCategory("personal");
      setDialogOpen(false);
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

  // Handle drag start
  const handleDragStart = (task: Task) => {
    setDraggingTask(task);
  };

  // Handle drop on a day
  const handleDrop = (date: Date) => {
    if (draggingTask) {
      setTasks(tasks.map(task => 
        task.id === draggingTask.id 
          ? { ...task, date } 
          : task
      ));
      setDraggingTask(null);
    }
  };

  // Get week dates starting from today
  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      dates.push(addDays(today, i));
    }
    return dates;
  };

  const weekDates = getWeekDates();
  
  // Get today's tasks
  const todayTasks = tasks.filter(task => 
    isSameDay(task.date, selectedDate)
  );

  const pendingTasks = todayTasks.filter(task => !task.completed);
  const completedTasks = todayTasks.filter(task => task.completed);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Task Manager</h1>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" /> Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task for {format(selectedDate, 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="task" className="text-sm font-medium">
                  Task description
                </label>
                <Input
                  id="task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task description..."
                  className="col-span-3"
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Category
                </label>
                <div className="flex gap-2">
                  {["personal", "health", "rehabilitation"].map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={newTaskCategory === category ? "default" : "outline"}
                      onClick={() => setNewTaskCategory(category)}
                      className="flex-1"
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Difficulty (1-10): {newDifficulty}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newDifficulty}
                  onChange={(e) => setNewDifficulty(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Date
                </label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTask}>
                Add Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
        <Tabs defaultValue="day" className="w-full">
          <div className="p-4 border-b">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="day">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Day View
              </TabsTrigger>
              <TabsTrigger value="week">
                <MoveHorizontal className="h-4 w-4 mr-2" />
                Week View
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="day" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</h2>
                <div className="bg-muted px-3 py-1 rounded-full text-sm">
                  Difficulty: {calculateDayDifficulty(tasks, selectedDate)}/10
                </div>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No pending tasks for today. Add a new task to get started!
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
                              <div className="px-1.5 py-0.5 rounded text-xs bg-cog-light-purple text-cog-purple">
                                Difficulty: {task.difficulty}
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

              {completedTasks.length > 0 && (
                <div className="mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between">
                        <span>Completed Tasks ({completedTasks.length})</span>
                        {showCompleted ? (
                          <ChevronUp className="h-4 w-4 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 ml-2" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full" align="start">
                      <div className="space-y-3 p-2">
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
                                    <div className="px-1.5 py-0.5 rounded text-xs opacity-50">
                                      Difficulty: {task.difficulty}
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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </TabsContent>

            <TabsContent value="week" className="mt-0">
              <h2 className="text-2xl font-semibold mb-4">Week View</h2>
              <p className="text-sm text-muted-foreground mb-4">Drag and drop tasks to balance your week</p>
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {weekDates.map((date) => {
                  const dayTasks = tasks.filter(task => 
                    isSameDay(task.date, date) && !task.completed
                  );
                  const dayDifficulty = calculateDayDifficulty(tasks, date);
                  
                  return (
                    <div 
                      key={format(date, 'yyyy-MM-dd')}
                      className={cn(
                        "border rounded-md p-2 min-h-[150px]",
                        isSameDay(date, new Date()) && "bg-muted/30 border-primary",
                      )}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(date)}
                    >
                      <div className="font-medium text-sm mb-1">
                        {format(date, 'EEE, MMM d')}
                      </div>
                      
                      <div className={cn(
                        "text-xs px-2 py-0.5 rounded-full mb-2 inline-block",
                        dayDifficulty > 7 ? "bg-red-100 text-red-700" :
                        dayDifficulty > 4 ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      )}>
                        {dayDifficulty}/10
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task)}
                            className="text-xs p-1 bg-card border rounded-sm cursor-move flex items-center justify-between group"
                          >
                            <div className="truncate">{task.title}</div>
                            <span className="bg-cog-light-purple text-cog-purple px-1 rounded text-xxs">
                              {task.difficulty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="mt-8 p-6 rounded-lg bg-cog-light-purple">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-cog-purple" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Message from your Occupational Therapist</h3>
            <p className="text-muted-foreground max-w-xl">
              Remember to break your tasks into manageable chunks. Try to keep your daily difficulty score 
              under 7 to avoid fatigue. If you're finding tasks particularly challenging, 
              we can discuss strategies during our next session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
