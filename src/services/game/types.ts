
export type GameProgressEntry = {
  id: string;
  game_type: string;
  category: string;
  score: number;
  max_score: number | null;
  level: number | null;
  time_taken: number | null;
  created_at: string;
};
