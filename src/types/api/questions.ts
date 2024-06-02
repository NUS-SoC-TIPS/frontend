import { Language } from '@/types/models/code';
import {
  QuestionDifficulty,
  QuestionSource,
  QuestionType,
} from '@/types/models/question';

// This is the minimal information needed by the frontend to
// render the question card element.
export interface QuestionBase {
  name: string;
  source: QuestionSource;
  difficulty: QuestionDifficulty;
  slug: string;
}

export interface QuestionListItem extends QuestionBase {
  type: QuestionType;
}

// This is the minimal information needed by the frontend to
// render the submission card element (with a clickable link)
export interface SubmissionBase {
  id: number;
  question: QuestionBase;
}

// Information needed by the frontend to render the table/list
// of submissions for a user
export interface SubmissionListItem extends SubmissionBase {
  submittedAt: Date;
  languageUsed: Language;
}

export interface SubmissionItem extends SubmissionListItem {
  question: QuestionListItem;
  codeWritten: string;
}

export interface CreateSubmissionDto {
  questionSlug: string;
  questionSource: QuestionSource;
  languageUsed: Language;
  codeWritten: string;
}

export interface UpdateSubmissionDto {
  languageUsed?: Language;
  codeWritten?: string;
}

export interface QuestionStatsProgress {
  // If currently in the middle of a window, the number will be returned
  // Else if not, it will be the number completed this week, with respect to SG time.
  numSubmissionsThisWindowOrWeek: number;
  numSubmissionsRequired: number | null; // null if not for window
  startOfWindowOrWeek: Date;
  endOfWindowOrWeek: Date;
  isWindow: boolean;
}

export interface QuestionStatsLanguageBreakdown {
  // Keys are values of the Language enum
  [language: string]: string;
}

export interface QuestionStats {
  progress: QuestionStatsProgress;
  latestSubmission: SubmissionListItem | null;
  // Potentially can reuse for the table
  languageBreakdown: QuestionStatsLanguageBreakdown;
}
