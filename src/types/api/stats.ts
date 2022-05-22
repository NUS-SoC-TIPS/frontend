import { Question } from 'types/models/question';
import { QuestionSubmission } from 'types/models/submission';
import { User } from 'types/models/user';
import { Window } from 'types/models/window';

import { RoomRecord } from './record';

export interface QuestionStats {
  // If currently in the middle of a window, the number will be returned
  // Else if not, it will be the number completed this week, with respect to SG time.
  numCompletedThisWindow: number;
  numCompletedAllTime: number;

  // Logic behind closest window:
  // - If currently in the middle of a window, that will be returned
  // - Else if there exists a window in the future, the upcoming window will be returned
  // - Else (all windows are over), the most recent window will be returned
  closestWindow: Window;
}

export interface TaskStatsSubmissions {
  submission: QuestionSubmission;
  question: Question;
}

export interface TaskStatsInterviews {
  record: RoomRecord;
  partner: User;
}

export interface TaskStatsWindow {
  window: Window;
  submissions: TaskStatsSubmissions[];
  interviews: TaskStatsInterviews[];
}

export interface TaskStats {
  windows: TaskStatsWindow[];
}
