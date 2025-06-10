
// Exercise difficulty recommendations based on cognitive load and complexity
export const exerciseRecommendations = {
  'memory match': { 
    difficulty: 4, 
    description: 'Visual memory training',
    displayName: 'Memory Match',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'number recall': { 
    difficulty: 5, 
    description: 'Working memory exercise',
    displayName: 'Number Recall',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'numbers': { 
    difficulty: 5, 
    description: 'Working memory exercise',
    displayName: 'Numbers Game',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'word finder': { 
    difficulty: 3, 
    description: 'Pattern recognition',
    displayName: 'Word Finder',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'rgb': { 
    difficulty: 6, 
    description: 'Color discrimination',
    displayName: 'RGB Color Game',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'faces': { 
    difficulty: 4, 
    description: 'Face recognition training',
    displayName: 'Faces Game',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'identification': { 
    difficulty: 3, 
    description: 'Object identification',
    displayName: 'Identification Game',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'names': { 
    difficulty: 5, 
    description: 'Name-face association',
    displayName: 'Names Game',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
  'then what': { 
    difficulty: 7, 
    description: 'Sequential reasoning',
    displayName: 'Then What Game',
    difficulties: { easy: 3, medium: 5, hard: 7 }
  },
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
    return { difficulty: 4, description: 'Cognitive exercise', displayName: 'Exercise', difficulties: { easy: 3, medium: 5, hard: 7 } };
  }
  
  return null;
};

export const isExerciseTask = (taskTitle: string) => {
  return getExerciseRecommendation(taskTitle) !== null;
};
