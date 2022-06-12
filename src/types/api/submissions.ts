import { Language } from 'types/models/code';
import { QuestionSource } from 'types/models/question';
import { SubmissionWithQuestion } from 'types/models/submission';
import { Window } from 'types/models/window';

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
  latestSubmission: SubmissionWithQuestion | null;
  // TODO: Look into replacing this with something more meaningful
  closestWindow: Window;
  allSubmissions: SubmissionWithQuestion[];
}
