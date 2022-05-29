import { Question } from 'types/models/question';
import { RoomRecord } from 'types/models/record';
import { QuestionSubmission } from 'types/models/submission';
import { User } from 'types/models/user';
import { Window } from 'types/models/window';

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
