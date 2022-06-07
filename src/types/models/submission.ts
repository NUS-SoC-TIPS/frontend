import { Language } from './code';
import { Question, QuestionSource } from './question';

export interface QuestionSubmission {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  languageUsed: Language;
  codeWritten: string;
  userId: string;
  questionSlug: string;
  questionSource: QuestionSource;
}

export interface SubmissionWithQuestion extends QuestionSubmission {
  question: Question;
}
