import { Language } from './code';
import { QuestionSource } from './question';
import { User } from './user';

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

export interface RecordWithPartner extends RoomRecord {
  partner: User;
  notes: string;
}
