import { Window } from 'types/models/window';

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
