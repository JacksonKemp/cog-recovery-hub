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
  BellOff,
  Clock,
  MoreVertical,
  Check
} from "lucide-react";
import { format, startOfWeek, addDays, isSameDay, parse, isEqual } from "date-fns";
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
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTasks } from "@/hooks/use-tasks";
import { useAuth } from "@/hooks/use-auth";
import type { Task } from "@/utils/taskUtils";

// Reminder time options
const reminderOptions = [
  { value: "15min", label: "15 minutes before" },
  { value: "30min", label: "30 minutes before" },
  { value: "1hour", label: "1 hour before" },
  { value: "2hours", label: "2 hours before" },
  { value: "1day", label: "1 day before" },
  { value: "2days", label: "2 days before" },
  { value: "1week", label: "1 week before" }
];

// Notification method options
const notificationOptions = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" }
];

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

// Check if a time slot is already taken
const isTimeSlotTaken = (tasks: Task[], date: Date, id?: string) => {
  return tasks.some(task => 
    isSameDay(task.date, date) && 
    format(task.date, 'HH:mm') === format(date, 'HH:mm') &&
    task.id !== id
  );
};

const TaskManager = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggingTask, setDraggingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [hasReminder, setHasReminder] = useState(false);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [selectedNotificationMethods, setSelectedNotificationMethods] = useState<string[]>(["email"]);
  const [taskDifficulty, setTaskDifficulty] = useState<number>(3);
  const [selectedTime, setSelectedTime] = useState<string>("12:00");
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictTargetDate, setConflictTargetDate] = useState<Date | null>(null);
  const [conflictNewTime, setConflictNewTime] = useState<string>("12:00");
  const [reminderDropdownOpen, setReminderDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // Use the database-connected hook
  const { 
    tasks, 
    isLoading, 
    addTask, 
    toggleTaskCompletion, 
    deleteTask, 
    updateTaskDate 
  } = useTasks();

  const handleAddTask = async () => {
    if (newTaskTitle.trim() !== "") {
      // Create task date (today by default)
      let taskDate = new Date();
      
      // If scheduling is enabled, set the custom date and time
      if (showSchedule) {
        // Get the hours and minutes from the selected time
        const [hours, minutes] = selectedTime.split(':').map(Number);
        
        // Create a new date with the selected date but with current time
        taskDate = new Date(selectedDate);
        // Set the time from the time picker
        taskDate.setHours(hours, minutes);
        
        // Check if the time slot is already taken
        if (isTimeSlotTaken(tasks, taskDate)) {
          toast({
            title: "Time Conflict",
            description: "There's already a task scheduled at this time.",
            variant: "destructive"
          });
          return;
        }
      }
      
      await addTask(
        newTaskTitle,
        taskDate,
        hasReminder,
        hasReminder ? selectedReminders : [],
        taskDifficulty,
        hasReminder ? selectedNotificationMethods : []
      );
      
      setNewTaskTitle("");
      setShowSchedule(false);
      setHasReminder(false);
      setSelectedReminders([]);
      setSelectedNotificationMethods(["email"]);
      setTaskDifficulty(3);
      setDialogOpen(false);
    }
  };

  // Handle drag start
  const handleDragStart = (task: Task) => {
    setDraggingTask(task);
  };

  // Handle drop on a day
  const handleDrop = (date: Date) => {
    if (draggingTask) {
      // Create a new date that combines the target date with the original time
      const newDate = new Date(date);
      newDate.setHours(
        draggingTask.date.getHours(),
        draggingTask.date.getMinutes()
      );
      
      // Check for time conflicts
      if (isTimeSlotTaken(tasks, newDate, draggingTask.id)) {
        // Instead of showing error toast, open conflict resolution dialog
        setConflictTargetDate(newDate);
        setConflictNewTime(format(draggingTask.date, 'HH:mm'));
        setConflictDialogOpen(true);
        return;
      }
      
      updateTaskDate(draggingTask.id, newDate);
      setDraggingTask(null);
    }
  };

  // Handle conflict resolution
  const handleConflictResolution = () => {
    if (draggingTask && conflictTargetDate) {
      const [hours, minutes] = conflictNewTime.split(':').map(Number);
      const finalDate = new Date(conflictTargetDate);
      finalDate.setHours(hours, minutes);

      // Check if the new time is still conflicted
      if (isTimeSlotTaken(tasks, finalDate, draggingTask.id)) {
        toast({
          title: "Time Still Conflicts",
          description: "Please choose a different time.",
          variant: "destructive"
        });
        return;
      }

      updateTaskDate(draggingTask.id, finalDate);

      // Reset conflict dialog state
      setConflictDialogOpen(false);
      setConflictTargetDate(null);
      setDraggingTask(null);
      
      toast({
        title: "Task Moved",
        description: `Task moved to ${format(finalDate, 'MMM d')} at ${format(finalDate, 'h:mm a')}`,
      });
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

  // Toggle reminder status for a task
  const toggleReminderSelection = (value: string) => {
    setSelectedReminders(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Toggle notification method selection
  const toggleNotificationMethod = (value: string) => {
    setSelectedNotificationMethods(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  // Show loading state if user is not authenticated or tasks are loading
  if (!user) {
    return (
      <div className="container py-4 md:py-8">
        <div className="text-center py-10 md:py-12 text-muted-foreground">
          Please log in to view your tasks.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-4 md:py-8">
        <div className="text-center py-10 md:py-12 text-muted-foreground">
          Loading your tasks...
        </div>
      </div>
    );
  }

  const weekDates = getWeekDates();
  
  // Get today's tasks
  const todayTasks = tasks.filter(task => 
    isSameDay(task.date, selectedDate)
  );

  const pendingTasks = todayTasks.filter(task => !task.completed);
  const completedTasks = todayTasks.filter(task => task.completed);
  
  // Generate times (every 30 minutes)
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Task Manager</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Today - {format(new Date(), 'MMMM d, yyyy')}</h2>
        
        {/* View Toggle Section */}
        <div className="rounded-lg border mb-6">
          <Tabs defaultValue="day" className="w-full">
            <div className="p-3 md:p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="day" className={cn(isMobile && "py-3")}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Day View
                </TabsTrigger>
                <TabsTrigger value="week" className={cn(isMobile && "py-3")}>
                  <MoveHorizontal className="h-4 w-4 mr-2" />
                  Week View
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-3 md:p-4">
              <TabsContent value="week" className="mt-0">
                <h3 className="text-lg font-semibold mb-4">Week View</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
                  {weekDates.map((date) => {
                    const dayTasks = tasks.filter(task => 
                      isSameDay(task.date, date) && !task.completed
                    );
                    
                    const totalDifficulty = calculateDayDifficulty(tasks, date);
                    
                    return (
                      <div 
                        key={format(date, 'yyyy-MM-dd')}
                        className={cn(
                          "border rounded-md p-2 min-h-[120px] md:min-h-[150px]",
                          isMobile && "mb-2",
                          isSameDay(date, new Date()) && "bg-muted/30 border-primary",
                        )}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => handleDrop(date)}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="font-medium text-sm mb-1">
                          {format(date, 'EEE, MMM d')}
                          {totalDifficulty > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 bg-muted text-xs rounded-full">
                              Difficulty: {totalDifficulty}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {dayTasks.map((task) => (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={() => handleDragStart(task)}
                              className={cn(
                                "text-xs p-1 bg-card border rounded-sm cursor-move flex items-center justify-between group",
                                isMobile && "p-2 text-sm"
                              )}
                            >
                              <div className="truncate flex-1">{task.title}</div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] opacity-70">
                                  {format(task.date, 'HH:mm') !== '00:00' && format(task.date, 'HH:mm')}
                                </span>
                                {task.hasReminder && <Bell className="h-3 w-3 text-cog-teal opacity-70" />}
                              </div>
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

        {/* Tasks Section */}
        {pendingTasks.length === 0 ? (
          <div className="text-center py-10 md:py-12 text-muted-foreground mb-6">
            No pending tasks for today. Add a new task to get started!
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {pendingTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className={cn(
                  "p-4 flex items-center justify-between",
                  isMobile && "p-3"
                )}>
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "mr-3 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted",
                            isMobile && "mr-2"
                          )}
                        >
                          <Circle className={cn("h-5 w-5", isMobile && "h-6 w-6")} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => toggleTaskCompletion(task.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteTask(task.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={cn("font-medium", isMobile && "text-base")}>{task.title}</p>
                        <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded">
                          Difficulty: {task.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
                        {!isSameDay(task.date, new Date()) && (
                          <div className="px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                            {format(task.date, 'MMM d, h:mm a')}
                          </div>
                        )}
                        {isSameDay(task.date, new Date()) && format(task.date, 'h:mm a') !== '12:00 AM' && (
                          <div className="px-1.5 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                            {format(task.date, 'h:mm a')}
                          </div>
                        )}
                        {task.hasReminder && (
                          <div className="flex items-center text-xs text-cog-teal">
                            <Bell className="h-3 w-3 mr-1" /> 
                            {task.reminderTimes.length > 0 && `${task.reminderTimes.length} reminder${task.reminderTimes.length > 1 ? 's' : ''}`}
                            {task.notificationMethods && task.notificationMethods.length > 0 && (
                              <span className="ml-1">
                                ({task.notificationMethods.join(', ')})
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex justify-between"
                  size={isMobile ? "mobile" : "default"}
                >
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
                      <CardContent className={cn(
                        "p-4 flex items-center justify-between",
                        isMobile && "p-3"
                      )}>
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className={cn("mr-3 text-cog-teal p-1 rounded-full hover:bg-muted", isMobile && "mr-2")}>
                                <CheckCircle className={cn("h-5 w-5", isMobile && "h-6 w-6")} fill="currentColor" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => toggleTaskCompletion(task.id)}>
                                <Circle className="h-4 w-4 mr-2" />
                                Mark Incomplete
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => deleteTask(task.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={cn(
                                "font-medium line-through",
                                isMobile && "text-base"
                              )}>
                                {task.title}
                              </p>
                              <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded">
                                Difficulty: {task.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Add Task Button and Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" size={isMobile ? "mobile" : "default"}>
            <Plus className="mr-2 h-4 w-4" /> Add New Task
          </Button>
        </DialogTrigger>
        <DialogContent className={cn("sm:max-w-[425px] max-h-[90vh] overflow-y-auto", isMobile && "mobile-dialog-content")}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task for your schedule
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Task Name */}
            <div className="grid gap-2">
              <label htmlFor="task" className="text-sm font-medium">
                Task Name
              </label>
              <Input
                id="task"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter task name..."
                className={cn("col-span-3", isMobile && "h-12 text-base")}
              />
            </div>
            
            {/* Difficulty Level */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Difficulty Level (1-10)
              </label>
              <Select 
                value={taskDifficulty.toString()} 
                onValueChange={(value) => setTaskDifficulty(parseInt(value))}
              >
                <SelectTrigger className={cn(isMobile && "h-12 text-base")}>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Schedule Option */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Schedule for Later
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size={isMobile ? "mobile" : "sm"}
                  onClick={() => setShowSchedule(!showSchedule)}
                  className={cn(
                    "w-[100px]",
                    showSchedule && "bg-muted text-foreground border-primary"
                  )}
                >
                  {showSchedule ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
            
            {/* Date & Time Selection */}
            {showSchedule && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Select Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        size={isMobile ? "mobile" : "default"}
                        className={cn(
                          "justify-start text-left font-normal",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, "MMMM d, yyyy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <label className="text-sm font-medium">
                    Select Time
                  </label>
                  <Select 
                    value={selectedTime}
                    onValueChange={setSelectedTime}
                  >
                    <SelectTrigger className={cn(isMobile && "h-12 text-base")}>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {times.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {/* Set Reminder - Dropdown */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Set Reminder
                </label>
                <DropdownMenu open={reminderDropdownOpen} onOpenChange={setReminderDropdownOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size={isMobile ? "mobile" : "sm"}
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
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-80 p-4 bg-background border shadow-lg" 
                    align="end"
                    side="bottom"
                    sticky="always"
                  >
                    <div className="space-y-4">
                      <div className="font-medium text-sm">Reminder Times (Select Multiple)</div>
                      <div className="space-y-3">
                        {reminderOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-3">
                            <Checkbox
                              id={`reminder-${option.value}`}
                              checked={selectedReminders.includes(option.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedReminders(prev => [...prev, option.value]);
                                  setHasReminder(true);
                                } else {
                                  setSelectedReminders(prev => prev.filter(item => item !== option.value));
                                  if (selectedReminders.length === 1) {
                                    setHasReminder(false);
                                  }
                                }
                              }}
                            />
                            <label 
                              htmlFor={`reminder-${option.value}`} 
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      
                      {/* Notification Methods */}
                      {hasReminder && (
                        <>
                          <div className="border-t pt-4">
                            <div className="font-medium text-sm mb-3">Notification Methods</div>
                            <div className="space-y-3">
                              {notificationOptions.map((option) => (
                                <div key={option.value} className="flex items-center space-x-3">
                                  <Checkbox
                                    id={`notification-${option.value}`}
                                    checked={selectedNotificationMethods.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedNotificationMethods(prev => [...prev, option.value]);
                                      } else {
                                        setSelectedNotificationMethods(prev => prev.filter(item => item !== option.value));
                                      }
                                    }}
                                  />
                                  <label 
                                    htmlFor={`notification-${option.value}`} 
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-end pt-2 border-t">
                        <Button
                          size="sm"
                          onClick={() => setReminderDropdownOpen(false)}
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          <DialogFooter className={cn(isMobile && "mobile-buttons-grid")}>
            <Button 
              type="submit" 
              onClick={handleAddTask}
              size={isMobile ? "mobile" : "default"}
              className={cn(isMobile && "mobile-button")}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Conflict Resolution Dialog */}
      <Dialog open={conflictDialogOpen} onOpenChange={setConflictDialogOpen}>
        <DialogContent className={cn("sm:max-w-[425px]", isMobile && "mobile-dialog-content")}>
          <DialogHeader>
            <DialogTitle>Time Conflict</DialogTitle>
            <DialogDescription>
              There's already a task scheduled at this time. Please choose a different time for "{draggingTask?.title}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Choose New Time
              </label>
              <Select 
                value={conflictNewTime}
                onValueChange={setConflictNewTime}
              >
                <SelectTrigger className={cn(isMobile && "h-12 text-base")}>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className={cn(isMobile && "mobile-buttons-grid")}>
            <Button 
              variant="outline"
              onClick={() => {
                setConflictDialogOpen(false);
                setConflictTargetDate(null);
                setDraggingTask(null);
              }}
              size={isMobile ? "mobile" : "default"}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConflictResolution}
              size={isMobile ? "mobile" : "default"}
              className={cn(isMobile && "mobile-button")}
            >
              Move Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-6 md:mt-8 p-4 md:p-6 rounded-lg bg-cog-light-teal">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-cog-teal" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold">Message from your Occupational Therapist</h3>
            <p className="text-muted-foreground max-w-xl">
              Breaking down tasks by difficulty helps manage your cognitive load throughout the day.
              Set reminders via SMS or email to stay on track with your rehabilitation goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
