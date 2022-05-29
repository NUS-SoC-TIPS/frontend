import { Language } from './code';
import { QuestionSource } from './question';

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

export interface RoomRecordUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isInterviewer: boolean;
  notes: string;
  userId: string;
  roomRecordId: number;
}
