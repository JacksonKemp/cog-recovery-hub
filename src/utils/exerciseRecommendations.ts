
// Exercise difficulty recommendations based on cognitive load and complexity
export const exerciseRecommendations = {
  'memory-match': { 
    difficulty: 4, 
    description: 'Visual memory training',
    displayName: 'Memory Match',
    route: '/games/memory-match'
  },
  'numbers': { 
    difficulty: 5, 
    description: 'Working memory exercise',
    displayName: 'Numbers Game',
    route: '/games/numbers'
  },
  'word-finder': { 
    difficulty: 3, 
    description: 'Pattern recognition',
    displayName: 'Word Finder',
    route: '/games/word-finder'
  },
  'rgb': { 
    difficulty: 6, 
    description: 'Color discrimination',
    displayName: 'RGB Game',
    route: '/games/rgb'
  },
  'faces': { 
    difficulty: 4, 
    description: 'Face recognition training',
    displayName: 'Faces Game',
    route: '/games/faces'
  },
  'identification': { 
    difficulty: 3, 
    description: 'Object identification',
    displayName: 'Identification Game',
    route: '/games/identification'
  },
  'names': { 
    difficulty: 5, 
    description: 'Name-face association',
    displayName: 'Names Game',
    route: '/games/names'
  },
  'then-what': { 
    difficulty: 7, 
    description: 'Sequential reasoning',
    displayName: 'Then What Game',
    route: '/games/then-what'
  },
};

export const getExerciseRecommendation = (taskTitle: string) => {
  const title = taskTitle.toLowerCase();
  
  // Check for exact matches or partial matches
  for (const [exercise, recommendation] of Object.entries(exerciseRecommendations)) {
    if (title.includes(exercise) || title.includes(exercise.replace('-', ' '))) {
      return recommendation;
    }
  }
  
  return null;
};

export const isExerciseTask = (taskTitle: string) => {
  return getExerciseRecommendation(taskTitle) !== null;
};

export const getExerciseRoute = (taskTitle: string) => {
  const recommendation = getExerciseRecommendation(taskTitle);
  return recommendation?.route || null;
};
