
import { useEffect, useCallback } from "react";
import { scheduleReminders, clearRemindersForTask } from "@/utils/reminderUtils";
import type { Task } from "@/utils/reminderUtils";

export function useReminders(tasks: Task[]) {
  // Schedule reminders for all tasks
  const updateAllReminders = useCallback(() => {
    tasks.forEach(task => {
      if (task.hasReminder && !task.completed) {
        scheduleReminders(task);
      }
    });
  }, [tasks]);

  // Update reminders when tasks change
  useEffect(() => {
    updateAllReminders();
    
    // Cleanup on unmount
    return () => {
      // We don't clear all reminders here as we want them to persist
      // even when the component unmounts
    };
  }, [updateAllReminders]);

  // Function to schedule a reminder for a single task
  const scheduleTaskReminders = useCallback((task: Task) => {
    if (task.hasReminder && !task.completed) {
      scheduleReminders(task);
    }
  }, []);

  // Function to clear reminders for a single task
  const clearTaskReminders = useCallback((taskId: string) => {
    clearRemindersForTask(taskId);
  }, []);

  return {
    scheduleTaskReminders,
    clearTaskReminders,
    updateAllReminders
  };
}
