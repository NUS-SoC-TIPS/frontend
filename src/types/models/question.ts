export interface Question {
  slug: string;
  id: number;
  name: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  source: QuestionSource;
  isPremium: boolean;
}

export enum QuestionDifficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionType {
  ALGORITHMS = 'ALGORITHMS',
  DATABASE = 'DATABASE',
  SHELL = 'SHELL',
  CONCURRENCY = 'CONCURRENCY',
}

export enum QuestionSource {
  LEETCODE = 'LEETCODE',
  HACKERRANK = 'HACKERRANK',
  KATTIS = 'KATTIS',
  CUSTOM = 'CUSTOM',
}
