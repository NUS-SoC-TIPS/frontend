import { Language } from './code';

export interface QuestionSubmission {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  languageUsed: Language;
  codeWritten: string;
  userId: string;
  questionSlug: string;
}
