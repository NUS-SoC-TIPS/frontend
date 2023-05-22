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
