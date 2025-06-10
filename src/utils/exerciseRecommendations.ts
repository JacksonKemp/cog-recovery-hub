
// Exercise difficulty recommendations based on cognitive load and complexity
export const exerciseRecommendations = {
  'memory match': { difficulty: 4, description: 'Visual memory training' },
  'number recall': { difficulty: 5, description: 'Working memory exercise' },
  'numbers': { difficulty: 5, description: 'Working memory exercise' },
  'word finder': { difficulty: 3, description: 'Pattern recognition' },
  'rgb': { difficulty: 6, description: 'Color discrimination' },
  'faces': { difficulty: 4, description: 'Face recognition training' },
  'identification': { difficulty: 3, description: 'Object identification' },
  'names': { difficulty: 5, description: 'Name-face association' },
  'then what': { difficulty: 7, description: 'Sequential reasoning' },
};

export const getExerciseRecommendation = (taskTitle: string) => {
  const title = taskTitle.toLowerCase();
  
  // Check for exact matches or partial matches
  for (const [exercise, recommendation] of Object.entries(exerciseRecommendations)) {
    if (title.includes(exercise) || title.includes(exercise.replace(' ', ''))) {
      return recommendation;
    }
  }
  
  // Check for general exercise keywords
  if (title.includes('exercise') || title.includes('game') || title.includes('training')) {
    return { difficulty: 4, description: 'Cognitive exercise' };
  }
  
  return null;
};

export const isExerciseTask = (taskTitle: string) => {
  return getExerciseRecommendation(taskTitle) !== null;
};
