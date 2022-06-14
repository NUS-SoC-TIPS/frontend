import { Exclusion } from 'types/models/exclusion';
import { User } from 'types/models/user';
import { Window } from 'types/models/window';

export interface CreateExclusionDto {
  userId: string;
  windowId: number;
  reason: string;
}

export interface UserThatHasYetToJoin {
  coursemologyName: string;
  coursemologyEmail: string;
  coursemologyProfileLink: string;
  githubUsername: string;
}

export interface UserWithWindowData extends User {
  coursemologyName: string;
  coursemologyEmail: string;
  coursemologyProfileLink: string;
  numberOfQuestions: number;
  numberOfInterviews: number;
  hasCompletedWindow: boolean;
}

export interface ExcludedUserWithWindowData extends UserWithWindowData {
  exclusion: Exclusion;
}

// If a user joins only in window 2, they will be present in
// window 2's stats but under "yet to join" in window 1.
export interface AdminStatsEntity extends Window {
  numberOfStudents: number; // Number of students who are on the platform by the end of the window
  numberOfCompletedStudents: number; // Number of students who have completed the targets
  averageNumberOfQuestions: number; // Average number of questions attempted by the students
  students: UserWithWindowData[];
  excludedStudents: ExcludedUserWithWindowData[];
  studentsYetToJoin: UserThatHasYetToJoin[];
  nonStudents: UserWithWindowData[];
}
