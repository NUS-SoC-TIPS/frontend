const options = {
  day: 'numeric' as const,
  month: 'short' as const,
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', options);
};
