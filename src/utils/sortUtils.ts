import { DIFFICULTY_TO_ORDER } from 'constants/enumOrders';
import { LANGUAGE_TO_STRING } from 'constants/enumStrings';
import { Language } from 'types/models/code';
import { QuestionDifficulty } from 'types/models/question';

export const compareCreatedAtsAscending = <T extends { createdAt: Date }>(
  a: T,
  b: T,
): number => {
  return compareDatesAscending(a.createdAt, b.createdAt);
};

export const compareCreatedAtsDescending = <T extends { createdAt: Date }>(
  a: T,
  b: T,
): number => {
  return -compareDatesAscending(a.createdAt, b.createdAt);
};

export const compareStartAtsDescending = <T extends { startAt: Date | null }>(
  a: T,
  b: T,
): number => {
  return -compareDatesAscending(a.startAt, b.startAt);
};

export const compareDatesAscending = (
  a: Date | null,
  b: Date | null,
): number => {
  if (a == null && b == null) {
    return 0;
  } else if (a == null) {
    return 1;
  } else if (b == null) {
    return -1;
  }
  return a.getTime() - b.getTime();
};

export const compareIdsAscending = <T extends { id: number }>(
  a: T,
  b: T,
): number => {
  return a.id - b.id;
};

export const compareNamesAscending = <T extends { name: string }>(
  a: T,
  b: T,
): number => {
  return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
};

export const compareBooleansTrueFirst = (a: boolean, b: boolean): number => {
  return String(b).localeCompare(String(a));
};

export const compareDifficultiesEasyFirst = (
  a: QuestionDifficulty,
  b: QuestionDifficulty,
): number => {
  return DIFFICULTY_TO_ORDER[a] - DIFFICULTY_TO_ORDER[b];
};

export const compareLanguagesAscending = (a: Language, b: Language): number => {
  return LANGUAGE_TO_STRING[a].localeCompare(LANGUAGE_TO_STRING[b]);
};
