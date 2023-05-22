import { Window } from 'types/models/window';

export const findCurrentWindow = (
  windows: Window[],
): { window: Window | null; index: number } => {
  if (windows.length === 0) {
    return { window: null, index: 0 };
  }
  const currentTime = new Date();
  const index = windows.findIndex(
    (w) => w.startAt <= currentTime && w.endAt >= currentTime,
  );
  if (index !== -1) {
    return { window: windows[index], index };
  }
  if (windows[0].startAt > currentTime) {
    return { window: windows[0], index: 0 };
  }
  const lastIndex = windows.length - 1;
  return { window: windows[lastIndex], index: lastIndex };
};
