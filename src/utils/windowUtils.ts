import { Window, WindowStatus } from 'types/models/window';

// If null is given, the return value will be { status: ONGOING, startAt: now, endAt: now }.
export const computeWindowData = (
  window: Window | undefined,
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
