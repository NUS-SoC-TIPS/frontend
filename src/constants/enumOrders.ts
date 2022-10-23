import { QuestionDifficulty } from 'types/models/question';

export const DIFFICULTY_TO_ORDER = Object.freeze({
  [QuestionDifficulty.EASY]: 0,
  [QuestionDifficulty.MEDIUM]: 1,
  [QuestionDifficulty.HARD]: 2,
});
