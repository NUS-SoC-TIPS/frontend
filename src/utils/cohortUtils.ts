import { COURSEMOLOGY_COURSE_URL_PREFIX } from '@/constants/urls';

export const stripPrefixForUrlField = <
  T extends {
    coursemologyUrl: string;
  },
>(
  cohort: T,
): T => {
  cohort.coursemologyUrl = cohort.coursemologyUrl.replace(
    COURSEMOLOGY_COURSE_URL_PREFIX,
    '',
  );
  return cohort;
};
