import { UserBase } from './users';

// This is the minimal information needed by the frontend to
// render the user card element with clickable link.
export interface StudentBase extends UserBase {
  coursemologyName: string; // Not really needed for the card but this is often paired with the profile link
  coursemologyProfileUrl: string;
}

export interface StudentBaseWithId extends StudentBase {
  studentId: number;
}
