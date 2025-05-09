
import { format, addMinutes, addHours, addDays, addWeeks, isAfter } from "date-fns";
import { toast } from "@/hooks/use-toast";

// Type defining a task 
export type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: Date;
  hasReminder: boolean;
  difficulty: number;
  reminderTimes: string[];
};

// Calculate reminder time based on task date and reminder option
export const calculateReminderTime = (taskDate: Date, reminderOption: string): Date => {
  const now = new Date();
  let reminderTime: Date;

  switch (reminderOption) {
    case "15min":
      reminderTime = addMinutes(taskDate, -15);
      break;
    case "30min":
      reminderTime = addMinutes(taskDate, -30);
      break;
    case "1hour":
      reminderTime = addHours(taskDate, -1);
      break;
    case "2hours":
      reminderTime = addHours(taskDate, -2);
      break;
    case "1day":
      reminderTime = addDays(taskDate, -1);
      break;
    case "2days":
      reminderTime = addDays(taskDate, -2);
      break;
    case "1week":
      reminderTime = addWeeks(taskDate, -1);
      break;
    default:
      reminderTime = taskDate;
  }

  // If the reminder time is in the past, return current time
  return isAfter(reminderTime, now) ? reminderTime : now;
};

// Schedule reminders for a task
export const scheduleReminders = (task: Task): void => {
  if (!task.hasReminder || !task.reminderTimes.length || task.completed) {
    return;
  }

  // Clear any existing reminders for this task
  clearRemindersForTask(task.id);

  // Schedule new reminders
  task.reminderTimes.forEach(reminderOption => {
    const reminderTime = calculateReminderTime(task.date, reminderOption);
    const now = new Date();
    
    // Calculate milliseconds until reminder
    const delay = reminderTime.getTime() - now.getTime();
    
    if (delay > 0) {
      // Store the timeout ID using the task ID and reminder option
      const timeoutId = setTimeout(() => {
        showNotification(task);
      }, delay);
      
      // Store in sessionStorage for persistence
      const reminderKey = `reminder_${task.id}_${reminderOption}`;
      const reminderData = {
        taskId: task.id,
        taskTitle: task.title,
        reminderTime: reminderTime.toISOString(),
        timeoutId: String(timeoutId)
      };
      sessionStorage.setItem(reminderKey, JSON.stringify(reminderData));
    }
  });
};

// Show a notification for a task
export const showNotification = (task: Task): void => {
  // Show toast notification
  toast({
    title: "Task Reminder",
    description: `Don't forget: ${task.title}`,
    variant: "default",
    duration: 10000, // Show for 10 seconds
  });

  // Show native browser notification if permission is granted
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification('Task Reminder', {
      body: `Don't forget: ${task.title}`,
      icon: '/favicon.ico'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      // Redirect to task page if needed
      window.location.href = '/tasks';
    };
  }
};

// Clear reminders for a specific task
export const clearRemindersForTask = (taskId: string): void => {
  // Find all reminders in sessionStorage for this task
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith(`reminder_${taskId}`)) {
      try {
        const reminderData = JSON.parse(sessionStorage.getItem(key) || '{}');
        if (reminderData.timeoutId) {
          clearTimeout(Number(reminderData.timeoutId));
        }
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error('Error clearing reminder:', error);
      }
    }
  }
};

// Initialize reminders from sessionStorage (to be called on app startup)
export const initializeReminders = (): void => {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('reminder_')) {
      try {
        const reminderData = JSON.parse(sessionStorage.getItem(key) || '{}');
        const now = new Date();
        const reminderTime = new Date(reminderData.reminderTime);
        const delay = reminderTime.getTime() - now.getTime();
        
        if (delay > 0) {
          const timeoutId = setTimeout(() => {
            const task = {
              id: reminderData.taskId,
              title: reminderData.taskTitle,
              completed: false,
              date: reminderTime,
              hasReminder: true,
              difficulty: 0,
              reminderTimes: []
            };
            showNotification(task);
            sessionStorage.removeItem(key);
          }, delay);
          
          // Update the timeout ID
          reminderData.timeoutId = String(timeoutId);
          sessionStorage.setItem(key, JSON.stringify(reminderData));
        } else {
          // If reminder time has passed, remove it
          sessionStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Error initializing reminder:', error);
      }
    }
  }
};
