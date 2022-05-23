export const DEFAULT_TOAST_PROPS = {
  duration: 3000,
  isClosable: true,
  position: 'bottom' as const,
};

export const ERROR_TOAST_PROPS = {
  ...DEFAULT_TOAST_PROPS,
  title: 'Uh oh!',
  description: 'Something went wrong. Please try again.',
  status: 'error' as const,
};
