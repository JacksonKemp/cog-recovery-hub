
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckSquare, 
  Trash2, 
  CheckCircle, 
  Circle, 
  CalendarIcon, 
  MoveHorizontal,
  Plus,
  ChevronDown,
  ChevronUp,
  Bell,
  BellOff
} from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  isEvent: boolean;
  hasReminder: boolean;
  difficulty?: number;
};

// Helper function to get day name
const getDayName = (date: Date) => {
  return format(date, 'EEEE');
};

// Helper to calculate total difficulty for a day
const calculateDayDifficulty = (tasks: Task[], date: Date) => {
  return tasks
    .filter(task => isSameDay(task.date, date) && !task.completed)
    .reduce((sum, task) => sum + (task.difficulty || 3), 0);
};

const TaskManager = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
  
  // Date selection for events
  const [selectedDay, setSelectedDay] = useState<string>("1");
  const [selectedMonth, setSelectedMonth] = useState<string>("5"); // May
  const [selectedTime, setSelectedTime] = useState<string>("12:00");
  
  // Sample tasks with dates as Date objects
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Take medication", 
      completed: false, 
      date: new Date(), 
      isEvent: false,
      hasReminder: true
    },
    { 
      id: "2", 
      title: "Doctor appointment", 
      completed: false, 
      date: addDays(new Date(), 1), 
      isEvent: true,
      hasReminder: true
    },
    { 
      id: "3", 
      title: "Complete memory exercises", 
      completed: true, 
      date: new Date(), 
      isEvent: false,
      hasReminder: false
    },
    { 
      id: "4", 
      title: "Call family member", 
      completed: false, 
      date: new Date(), 
      isEvent: false,
      hasReminder: false
    }
  ]);

  const handleAddTask = () => {
    if (newTaskTitle.trim() !== "") {
      let taskDate = new Date();
      
      // If it's an event, use the selected date and time
      if (isEvent) {
        const year = new Date().getFullYear();
        const month = parseInt(selectedMonth) - 1; // 0-indexed
        const day = parseInt(selectedDay);
        const [hours, minutes] = selectedTime.split(':').map(Number);
        
        taskDate = new Date(year, month, day, hours, minutes);
      }
      
      const task: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        date: taskDate,
        isEvent,
        hasReminder,
      };
      
      setTasks([task, ...tasks]);
      setNewTaskTitle("");
      setIsEvent(false);
      setHasReminder(false);
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

  // Generate days for select options (1-31)
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  
  // Generate months (1-12)
  const months = [
    "1", "2", "3", "4", "5", "6", 
    "7", "8", "9", "10", "11", "12"
  ];
  
  // Generate times (hourly)
  const times = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Task Manager</h1>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Create a new task or event
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Item Name */}
              <div className="grid gap-2">
                <label htmlFor="task" className="text-sm font-medium">
                  Item Name
                </label>
                <Input
                  id="task"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Enter item name..."
                  className="col-span-3"
                />
              </div>
              
              {/* Task or Event selection */}
              <div className="grid gap-2">
                <label className="text-sm font-medium">
                  Type
                </label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={!isEvent ? "default" : "outline"}
                    onClick={() => setIsEvent(false)}
                    className="flex-1"
                  >
                    Task
                  </Button>
                  <Button
                    type="button"
                    variant={isEvent ? "default" : "outline"}
                    onClick={() => setIsEvent(true)}
                    className="flex-1"
                  >
                    Event
                  </Button>
                </div>
              </div>
              
              {/* Date selection for events */}
              {isEvent && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Date & Time
                  </label>
                  <div className="flex gap-2">
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, index) => (
                          <SelectItem key={month} value={month}>
                            {monthNames[index]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Time" />
                      </SelectTrigger>
                      <SelectContent>
                        {times.map(time => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {/* Reminder toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Set Reminder
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setHasReminder(!hasReminder)}
                  className={cn(
                    "w-[100px]",
                    hasReminder && "bg-cog-light-teal text-cog-teal border-cog-teal"
                  )}
                >
                  {hasReminder ? (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      On
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4 mr-2" />
                      Off
                    </>
                  )}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddTask}>
                Add Item
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
              <h2 className="text-2xl font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</h2>

              {pendingTasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No pending tasks for today. Add a new item to get started!
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
                            <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
                              {task.isEvent && (
                                <div className="px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                  {format(task.date, 'MMM d, h:mm a')}
                                </div>
                              )}
                              {task.hasReminder && (
                                <div className="flex items-center text-xs text-cog-teal">
                                  <Bell className="h-3 w-3 mr-1" /> Reminder
                                </div>
                              )}
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
                        <span>Completed Items ({completedTasks.length})</span>
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
                                  className="mr-3 text-cog-teal"
                                  onClick={() => toggleTaskCompletion(task.id)}
                                >
                                  <CheckCircle className="h-5 w-5" fill="currentColor" />
                                </button>
                                <div>
                                  <p className="font-medium line-through">{task.title}</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                {weekDates.map((date) => {
                  const dayTasks = tasks.filter(task => 
                    isSameDay(task.date, date) && !task.completed
                  );
                  
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
                      
                      <div className="space-y-1">
                        {dayTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={() => handleDragStart(task)}
                            className="text-xs p-1 bg-card border rounded-sm cursor-move flex items-center justify-between group"
                          >
                            <div className="truncate">{task.title}</div>
                            {task.hasReminder && <Bell className="h-3 w-3 text-cog-teal opacity-70" />}
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

      <div className="mt-8 p-6 rounded-lg bg-cog-light-teal">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-cog-teal" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Message from your Occupational Therapist</h3>
            <p className="text-muted-foreground max-w-xl">
              The simplified task manager helps you keep track of your schedule without overwhelming you.
              Don't forget to set reminders for important items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
