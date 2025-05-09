
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useReminders } from '@/hooks/use-reminders';
import { saveTasks, loadTasks, createTask } from '@/utils/taskUtils';
import type { Task } from '@/utils/reminderUtils';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const { scheduleTaskReminders, clearTaskReminders } = useReminders(tasks);

  // Initialize tasks from localStorage
  useEffect(() => {
    const loadedTasks = loadTasks();
    if (loadedTasks.length > 0) {
      setTasks(loadedTasks);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Add a new task
  const addTask = useCallback((
    title: string,
    date: Date,
    hasReminder: boolean,
    reminderTimes: string[],
    difficulty: number
  ) => {
    const newTask = createTask(title, date, hasReminder, reminderTimes, difficulty);
    
    setTasks(prevTasks => {
      const updatedTasks = [newTask, ...prevTasks];
      saveTasks(updatedTasks);
      return updatedTasks;
    });
    
    if (hasReminder) {
      scheduleTaskReminders(newTask);
      toast({
        title: "Reminder Set",
        description: `You'll be reminded about "${title}"`,
        duration: 3000,
      });
    }
    
    return newTask;
  }, [scheduleTaskReminders, toast]);

  // Toggle a task's completion status
  const toggleTaskCompletion = useCallback((id: string) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          
          // If task is now completed, clear its reminders
          if (updatedTask.completed && updatedTask.hasReminder) {
            clearTaskReminders(id);
          } 
          // If task is now uncompleted and has reminders, reschedule them
          else if (!updatedTask.completed && updatedTask.hasReminder) {
            scheduleTaskReminders(updatedTask);
          }
          
          return updatedTask;
        }
        return task;
      });
      
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }, [clearTaskReminders, scheduleTaskReminders]);

  // Delete a task
  const deleteTask = useCallback((id: string) => {
    // First clear any reminders for this task
    clearTaskReminders(id);
    
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }, [clearTaskReminders]);

  // Update a task's date (for drag and drop functionality)
  const updateTaskDate = useCallback((taskId: string, newDate: Date) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task => {
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
      });
      
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }, [clearTaskReminders, scheduleTaskReminders]);

  return {
    tasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
    updateTaskDate
  };
}
