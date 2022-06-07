import { RecordWithPartner } from 'types/models/record';
import { SubmissionWithQuestion } from 'types/models/submission';
import { Window } from 'types/models/window';

export enum TaskStatWindowStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  NONE = 'NONE',
}

export interface TaskStatWindow extends Window {
  submissions: SubmissionWithQuestion[];
  records: RecordWithPartner[];
  hasCompletedInterview: boolean;
  hasCompletedQuestions: boolean;
  status: TaskStatWindowStatus;
}

export type TaskStatsEntity = TaskStatWindow[];
