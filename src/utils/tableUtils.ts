import {
  DIFFICULTY_TO_STRING,
  LANGUAGE_TO_STRING,
  SOURCE_TO_STRING,
} from '@/constants/enumStrings';
import { Language } from '@/types/models/code';
import { QuestionDifficulty, QuestionSource } from '@/types/models/question';

export const languageRenderer = (language: Language): string =>
  LANGUAGE_TO_STRING[language];

export const sourceRenderer = (source: QuestionSource): string =>
  SOURCE_TO_STRING[source];

export const difficultyRenderer = (difficulty: QuestionDifficulty): string =>
  DIFFICULTY_TO_STRING[difficulty];

export const booleanRenderer = (bool: boolean): string => (bool ? 'Yes' : 'No');

export const exclusionRenderer = (
  exclusion: { reason: string } | undefined,
): string => exclusion?.reason ?? '-';
