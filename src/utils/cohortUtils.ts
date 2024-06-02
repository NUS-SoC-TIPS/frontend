import {
  COHORT_EMAIL_SUFFIX,
  COURSEMOLOGY_COURSE_URL_PREFIX,
} from '@/constants/urls';

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

export const stripSuffixForEmailField = <
  T extends {
    email: string;
  },
>(
  cohort: T,
): T => {
  cohort.email = cohort.email.replace(COHORT_EMAIL_SUFFIX, '');
  return cohort;
};
