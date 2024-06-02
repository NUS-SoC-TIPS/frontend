export const SITE_URL = `${window.location.protocol}//${window.location.host}`;
export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
}/image/upload`;
export const COURSEMOLOGY_COURSE_URL_PREFIX =
  'https://coursemology.org/courses/';
export const COHORT_EMAIL_SUFFIX = '@googlegroups.com';
