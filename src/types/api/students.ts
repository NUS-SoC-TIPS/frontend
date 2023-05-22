import { UserBase } from './users';

// This is the minimal information needed by the frontend to
// render the user card element with clickable link.
export interface StudentBase extends UserBase {
  coursemologyProfileUrl: string;
}
