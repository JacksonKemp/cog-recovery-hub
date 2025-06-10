
// AI-generated practitioner messages for cognitive rehabilitation guidance
export interface PractitionerMessage {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  category: 'task_management' | 'cognitive_load' | 'reminders' | 'progress' | 'general';
}

const messageTemplates: Omit<PractitionerMessage, 'id' | 'timestamp'>[] = [
  {
    title: "Message from your Occupational Therapist",
    message: "Breaking down tasks by difficulty helps manage your cognitive load throughout the day. Set reminders via SMS or email to stay on track with your rehabilitation goals.",
    category: 'task_management'
  },
  {
    title: "Cognitive Load Management Tip",
    message: "Start with easier tasks (difficulty 1-2) in the morning when your cognitive energy is highest. Save more challenging tasks for your peak performance times.",
    category: 'cognitive_load'
  },
  {
    title: "Reminder Strategy",
    message: "Multiple reminder methods work best for memory support. Try setting both SMS and email notifications 30 minutes before important tasks.",
    category: 'reminders'
  },
  {
    title: "Progress Update",
    message: "Your consistent task completion is building important cognitive pathways. Keep up the excellent work with your daily exercises!",
    category: 'progress'
  },
  {
    title: "Weekly Check-in",
    message: "Remember to adjust task difficulty based on your energy levels. It's normal for cognitive abilities to fluctuate throughout your recovery.",
    category: 'general'
  },
  {
    title: "Exercise Recommendation",
    message: "Combining task management with cognitive exercises creates powerful rehabilitation routines. Try completing a memory game after finishing your daily tasks.",
    category: 'general'
  },
  {
    title: "Stress Management",
    message: "If tasks feel overwhelming, break them into smaller steps. Use the difficulty slider to match tasks to your current cognitive capacity.",
    category: 'cognitive_load'
  },
  {
    title: "Routine Building",
    message: "Establishing consistent daily routines supports cognitive recovery. Try scheduling similar tasks at the same time each day.",
    category: 'task_management'
  }
];

export const generatePractitionerMessage = (): PractitionerMessage => {
  const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
  
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date(),
    ...template
  };
};

export const getPractitionerMessage = (): PractitionerMessage => {
  // For now, return a random message. In the future, this could be based on:
  // - User's recent task completion patterns
  // - Time since last message
  // - Current cognitive load trends
  // - Upcoming scheduled tasks
  
  return generatePractitionerMessage();
};
