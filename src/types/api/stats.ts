import { Question } from 'types/models/question';
import { QuestionSubmission } from 'types/models/submission';
import { User } from 'types/models/user';
import { Window } from 'types/models/window';

import { RoomRecord } from './record';

export interface SubmissionQuestionData extends QuestionSubmission {
  question: Question;
}

export interface QuestionStats {
  // If currently in the middle of a window, the number will be returned
  // Else if not, it will be the number completed this week, with respect to SG time.
  numCompletedThisWindow: number;

  latestSubmission: SubmissionQuestionData | null;

  // Logic behind closest window:
  // - If currently in the middle of a window, that will be returned
  // - Else if there exists a window in the future, the upcoming window will be returned
  // - Else (all windows are over), the most recent window will be returned
  closestWindow: Window;
}

export interface TaskStatSubmission extends QuestionSubmission {
  question: Question;
}

export interface TaskStatInterview extends RoomRecord {
  partner: User;
}

export enum TaskStatWindowStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  NONE = 'NONE',
}

export interface TaskStatWindow extends Window {
  submissions: TaskStatSubmission[];
  interviews: TaskStatInterview[];
  hasCompletedSubmissions: boolean;
  hasCompletedInterview: boolean;
  status: TaskStatWindowStatus;
}

export type TaskStats = TaskStatWindow[];
