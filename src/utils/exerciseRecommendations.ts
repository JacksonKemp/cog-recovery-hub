
// Exercise difficulty recommendations based on cognitive load and complexity
export const exerciseRecommendations = {
  'memory-match': { 
    description: 'Visual memory training',
    displayName: 'Memory Match',
    route: '/games/memory-match',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
  },
  'numbers': { 
    description: 'Working memory exercise',
    displayName: 'Numbers Game',
    route: '/games/numbers',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
  },
  'word-finder': { 
    description: 'Pattern recognition',
    displayName: 'Word Finder',
    route: '/games/word-finder',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
  },
  'rgb': { 
    description: 'Color discrimination',
    displayName: 'RGB Game',
    route: '/games/rgb',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
  },
  'faces': { 
    description: 'Face recognition training',
    displayName: 'Faces Game',
    route: '/games/faces',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
  },
  'identification': { 
    description: 'Object identification',
    displayName: 'Identification Game',
    route: '/games/identification',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
  },
  'names': { 
    description: 'Name-face association',
    displayName: 'Names Game',
    route: '/games/names',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
  },
  'then-what': { 
    description: 'Sequential reasoning',
    displayName: 'Then What Game',
    route: '/games/then-what',
    difficulties: {
      easy: 5,
      medium: 7,
      hard: 9
    }
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
