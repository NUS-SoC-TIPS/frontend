export interface Window {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  startAt: Date;
  endAt: Date;
  iteration: number;
  requireInterview: boolean;
  numQuestions: number;
}

// This is in order of precedence, i.e. even if there is an upcoming window,
// if we're in the middle of an ongoing window, ongoing will be dominant.
export enum WindowStatus {
  ONGOING,
  UPCOMING,
  OVER,
}
