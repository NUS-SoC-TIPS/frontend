import { InterviewBase } from './interviews';
import { SubmissionBase } from './questions';
import { StudentBase } from './students';
import { WindowBase } from './windows';

export interface CohortListItem {
  id: number;
  name: string;
  status: 'COMPLETED' | 'FAILED' | 'IN PROGRESS' | 'HAS NOT STARTED';
  startAt: Date | null;
  endAt: Date | null;
}

export interface CohortItem {
  name: string;
  coursemologyUrl: string;
  windows: (WindowBase & {
    exclusion: {
      reason: string; // TODO: Make this an enum
    } | null;
    previouslyExcluded: boolean; // Whether the student was already excluded prior to this window
    hasCompletedQuestions: boolean;
    hasCompletedInterview: boolean;
    submissions: SubmissionBase[];
    interviews: InterviewBase[];
    pairedPartner: StudentBase | null;
  })[];
}
