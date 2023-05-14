import { Language } from 'types/models/code';
import { QuestionSource } from 'types/models/question';
import { SubmissionWithQuestion } from 'types/models/submission';

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

export interface SubmissionStatsEntity {
  // If currently in the middle of a window, the number will be returned
  // Else if not, it will be the number completed this week, with respect to SG time.
  numberOfSubmissionsForThisWindowOrWeek: number;
  // If this is null, that means the number of submissions is for this week. If it's non-null, then
  // the number of submissions is for this current window.
  numQuestions: number | null;
  latestSubmission: SubmissionWithQuestion | null;
  stats: {
    numEasyCompleted: number;
    numMediumCompleted: number;
    numHardCompleted: number;
  };
  allSubmissions: SubmissionWithQuestion[];
}
