import { difficultyToOrder } from 'constants/enumOrders';
import { languageToString } from 'constants/enumStrings';
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

export const compareStartAtsDescending = <T extends { startAt: Date }>(
  a: T,
  b: T,
): number => {
  return -compareDatesAscending(a.startAt, b.startAt);
};

export const compareDatesAscending = (a: Date, b: Date): number => {
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

export const compareDifficultiesEasyFirst = (
  a: QuestionDifficulty,
  b: QuestionDifficulty,
): number => {
  return difficultyToOrder[a] - difficultyToOrder[b];
};

export const compareLanguagesAscending = (a: Language, b: Language): number => {
  return languageToString[a].localeCompare(languageToString[b]);
};
