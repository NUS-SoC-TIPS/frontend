import { Window, WindowStatus } from 'types/models/window';

// TODO: Consider deleting this
export const computeWindowData = (
  window: Window,
): { status: WindowStatus; startAt: Date; endAt: Date } => {
  const currentTime = new Date();
  const startAt = window?.startAt ?? currentTime;
  const endAt = window?.endAt ?? currentTime;
  if (startAt <= currentTime && currentTime <= endAt) {
    return { status: WindowStatus.ONGOING, startAt, endAt };
  } else if (startAt > currentTime) {
    return { status: WindowStatus.UPCOMING, startAt, endAt };
  }
  return { status: WindowStatus.OVER, startAt, endAt };
};

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
