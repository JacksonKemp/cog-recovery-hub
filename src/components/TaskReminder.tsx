
import React, { useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useReminders } from "@/hooks/use-reminders";
import type { Task } from "@/utils/reminderUtils";

interface TaskReminderProps {
  tasks: Task[];
}

export const TaskReminder: React.FC<TaskReminderProps> = ({ tasks }) => {
  const { toast } = useToast();
  const { updateAllReminders } = useReminders(tasks);
  
  // Update all reminders when the component mounts
  useEffect(() => {
    updateAllReminders();
    
    // Show a toast that reminders are active if permission is granted
    if ('Notification' in window && Notification.permission === 'granted') {
      toast({
        title: "Reminders Active",
        description: "You will receive notifications for your upcoming tasks.",
        duration: 3000,
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      // Request permission if not already granted or denied
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast({
            title: "Notifications Enabled",
            description: "You will now receive task reminders.",
            duration: 3000,
          });
          updateAllReminders();
        }
      });
    }
  }, []);
  
  // This is a non-visual component that just manages the reminders
  return null;
};
