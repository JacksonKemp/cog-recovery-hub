
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  date: Date;
  hasReminder: boolean;
  difficulty: number;
  reminderTimes: string[];
  notificationMethods: string[];
  user_id?: string;
};

// Save tasks to Supabase
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  // This function is no longer needed as we'll use individual operations
  console.log('saveTasks called but not implemented for Supabase');
};

// Load tasks from Supabase
export const loadTasks = async (): Promise<Task[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error loading tasks:', error);
      return [];
    }

    return (data || []).map(task => ({
      id: task.id,
      title: task.title,
      completed: task.completed,
      date: new Date(task.date),
      hasReminder: task.has_reminder,
      difficulty: task.difficulty,
      reminderTimes: task.reminder_times || [],
      notificationMethods: task.notification_methods || ['email'],
      user_id: task.user_id
    }));
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

// Create a new task in Supabase
export const createTask = async (
  title: string,
  date: Date,
  hasReminder: boolean,
  reminderTimes: string[],
  difficulty: number,
  notificationMethods: string[]
): Promise<Task | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title,
        date: date.toISOString(),
        has_reminder: hasReminder,
        reminder_times: reminderTimes,
        difficulty,
        notification_methods: notificationMethods,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      completed: data.completed,
      date: new Date(data.date),
      hasReminder: data.has_reminder,
      difficulty: data.difficulty,
      reminderTimes: data.reminder_times || [],
      notificationMethods: data.notification_methods || ['email'],
      user_id: data.user_id
    };
  } catch (error) {
    console.error('Error creating task:', error);
    return null;
  }
};

// Update a task in Supabase
export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<boolean> => {
  try {
    const dbUpdates: any = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
    if (updates.date !== undefined) dbUpdates.date = updates.date.toISOString();
    if (updates.hasReminder !== undefined) dbUpdates.has_reminder = updates.hasReminder;
    if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
    if (updates.reminderTimes !== undefined) dbUpdates.reminder_times = updates.reminderTimes;
    if (updates.notificationMethods !== undefined) dbUpdates.notification_methods = updates.notificationMethods;

    const { error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

// Delete a task from Supabase
export const deleteTask = async (taskId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
};
