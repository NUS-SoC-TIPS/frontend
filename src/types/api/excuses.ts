import { ExcuseFrom, ExcuseStatus } from '../models/excuse';

import { UserBase } from './users';
import { WindowBase } from './windows';

export interface ExcuseBase {
  id: number;
  user: UserBase;
  window: WindowBase;
  excuseFrom: ExcuseFrom;
  reason: string;
  status: ExcuseStatus;
}

export interface CreateExcuseDto {
  windowId: number;
  excuseFrom: ExcuseFrom;
  reason: string;
}
