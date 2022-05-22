import { Language } from 'types/models/code';
import { QuestionSource } from 'types/models/question';

export interface RoomRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isRoleplay: boolean;
  duration: number;
  language: Language;
  codeWritten: string;
  isSolved: boolean;
  roomId: number;
  questionSlug: string | null;
  questionSource: QuestionSource | null;
}
