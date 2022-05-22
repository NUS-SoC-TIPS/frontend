import { Language } from 'types/models/code';

export interface CreateSubmissionDto {
  questionSlug: string;
  languageUsed: Language;
  codeWritten: string;
}
