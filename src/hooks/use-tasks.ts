
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useReminders } from '@/hooks/use-reminders';
import { loadTasks, createTask, updateTask, deleteTask } from '@/utils/taskUtils';
import type { Task } from '@/utils/taskUtils';
import { useAuth } from '@/hooks/use-auth';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { scheduleTaskReminders, clearTaskReminders } = useReminders(tasks);
  const { user } = useAuth();

  // Load tasks from database
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Initialize tasks from database when user is available
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const addTask = useCallback(async (
    title: string,
    date: Date,
    hasReminder: boolean,
    reminderTimes: string[],
    difficulty: number
  ) => {
    try {
      const newTask = await createTask(title, date, hasReminder, reminderTimes, difficulty);
      
      if (newTask) {
        setTasks(prevTasks => [newTask, ...prevTasks]);
        
        if (hasReminder) {
          scheduleTaskReminders(newTask);
          toast({
            title: "Reminder Set",
            description: `You'll be reminded about "${title}"`,
            duration: 3000,
          });
        }
        
        toast({
          title: "Task Created",
          description: `"${title}" has been added to your tasks`,
          duration: 3000,
        });
        
        return newTask;
      } else {
        toast({
          title: "Error",
          description: "Failed to create task",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  }, [scheduleTaskReminders, toast]);

  // Toggle a task's completion status
  const toggleTaskCompletion = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newCompletedStatus = !task.completed;
    
    try {
      const success = await updateTask(id, { completed: newCompletedStatus });
      
      if (success) {
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === id) {
              const updatedTask = { ...task, completed: newCompletedStatus };
              
              // Handle reminders
              if (updatedTask.completed && updatedTask.hasReminder) {
                clearTaskReminders(id);
              } else if (!updatedTask.completed && updatedTask.hasReminder) {
                scheduleTaskReminders(updatedTask);
              }
              
              return updatedTask;
            }
            return task;
          })
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  }, [tasks, clearTaskReminders, scheduleTaskReminders, toast]);

  // Delete a task
  const deleteTaskById = useCallback(async (id: string) => {
    try {
      clearTaskReminders(id);
      
      const success = await deleteTask(id);
      
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
        toast({
          title: "Task Deleted",
          description: "Task has been removed",
          duration: 3000,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  }, [clearTaskReminders, toast]);

  // Update a task's date (for drag and drop functionality)
  const updateTaskDate = useCallback(async (taskId: string, newDate: Date) => {
    try {
      const success = await updateTask(taskId, { date: newDate });
      
      if (success) {
        setTasks(prevTasks =>
          prevTasks.map(task => {
            if (task.id === taskId) {
              const updatedTask = { ...task, date: newDate };
              
              // Reschedule reminders if task has reminders
              if (updatedTask.hasReminder && !updatedTask.completed) {
                clearTaskReminders(taskId);
                scheduleTaskReminders(updatedTask);
              }
              
              return updatedTask;
            }
            return task;
          })
        );
      } else {
        toast({
          title: "Error",
          description: "Failed to update task date",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating task date:', error);
      toast({
        title: "Error",
        description: "Failed to update task date",
        variant: "destructive",
      });
    }
  }, [clearTaskReminders, scheduleTaskReminders, toast]);

  return {
    tasks,
    isLoading,
    addTask,
    toggleTaskCompletion,
    deleteTask: deleteTaskById,
    updateTaskDate,
    refetchTasks: fetchTasks
  };
}
