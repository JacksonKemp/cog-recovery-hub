
import { Task } from "./reminderUtils";
import { v4 as uuidv4 } from "uuid";

// Save tasks to localStorage for persistence
export const saveTasks = (tasks: Task[]): void => {
  // Convert Date objects to ISO strings before saving
  const serializedTasks = tasks.map(task => ({
    ...task,
    date: task.date.toISOString()
  }));
  
  localStorage.setItem('tasks', JSON.stringify(serializedTasks));
};

// Load tasks from localStorage
export const loadTasks = (): Task[] => {
  try {
    const storedTasks = localStorage.getItem('tasks');
    if (!storedTasks) return [];
    
    // Parse the JSON and convert ISO strings back to Date objects
    const parsedTasks = JSON.parse(storedTasks);
    return parsedTasks.map((task: any) => ({
      ...task,
      date: new Date(task.date)
    }));
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

// Create a new task
export const createTask = (
  title: string,
  date: Date,
  hasReminder: boolean,
  reminderTimes: string[],
  difficulty: number
): Task => {
  return {
    id: uuidv4(),
    title,
    completed: false,
    date,
    hasReminder,
    difficulty,
    reminderTimes,
  };
};
