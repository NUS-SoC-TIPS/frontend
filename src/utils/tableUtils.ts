import {
  difficultyToString,
  languageToString,
  sourceToString,
} from 'constants/enumStrings';
import { Language } from 'types/models/code';
import { Exclusion } from 'types/models/exclusion';
import { QuestionDifficulty, QuestionSource } from 'types/models/question';

export const languageRenderer = (language: Language): string =>
  languageToString[language];

export const sourceRenderer = (source: QuestionSource): string =>
  sourceToString[source];

export const difficultyRenderer = (difficulty: QuestionDifficulty): string =>
  difficultyToString[difficulty];

export const booleanRenderer = (bool: boolean): string => (bool ? 'Yes' : 'No');

export const exclusionRenderer = (exclusion: Exclusion | undefined): string =>
  exclusion?.reason ?? '-';
