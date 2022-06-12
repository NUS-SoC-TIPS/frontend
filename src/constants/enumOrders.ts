import { QuestionDifficulty } from 'types/models/question';

export const difficultyToOrder = Object.freeze({
  [QuestionDifficulty.EASY]: 0,
  [QuestionDifficulty.MEDIUM]: 1,
  [QuestionDifficulty.HARD]: 2,
});
