import { UserBase } from './users';

export interface ExcuseBase {
  id: number;
  user: UserBase;
  excuseFrom: 'interview' | 'question' | 'interview_and_question';
  excuseReason: string;
  status: 'pending' | 'accepted' | 'rejected';
}
