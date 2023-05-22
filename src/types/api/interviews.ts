// This is the minimal information needed by the frontend to

import { Language } from 'types/models/code';

import { StudentBase } from './students';
import { UserBase } from './users';

// render the interview card element (with a clickable link)
export interface InterviewBase {
  id: number;
  partner: UserBase;
}

export interface InterviewListItem extends InterviewBase {
  completedAt: Date;
  duration: number;
  language: Language; // Deprecate once replay is introduced
}

// Completely different because of how the current UI is designed.
// To be reworked once replay is introduced
export interface InterviewItem {
  completedAt: Date;
  duration: number;
  partner: {
    name: string;
    notes: string;
  };
  codeWritten: string;
  language: Language;
}

export interface InterviewStatsProgress {
  // If currently in the middle of a window, the number will be returned
  // Else if not, it will be the number completed this week, with respect to SG time.
  numInterviewsThisWindowOrWeek: number;
  isInterviewRequired: boolean | null; // null if not for window
  startOfWindowOrWeek: Date;
  endOfWindowOrWeek: Date;
  isWindow: boolean;
}

export interface InterviewStats {
  progress: InterviewStatsProgress;
  averageDurationMs: number; // 0 if no interviews done
  pairedOrLatestPartner: UserBase | StudentBase | null;
}
