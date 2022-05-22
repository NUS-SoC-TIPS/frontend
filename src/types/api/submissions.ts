import { Language } from 'types/models/code';
import { QuestionSource } from 'types/models/question';

export interface CreateSubmissionDto {
  questionSlug: string;
  questionSource: QuestionSource;
  languageUsed: Language;
  codeWritten: string;
}
