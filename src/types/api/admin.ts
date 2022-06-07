import { User } from 'types/models/user';
import { Window } from 'types/models/window';

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
  hasCompletedQuestions: boolean;
  hasCompletedInterview: boolean;
}

// If a user joins only in window 2, they will be present in
// window 2's stats but under "yet to join" in window 1.
export interface AdminStatWindow extends Window {
  numberOfStudents: number; // Number of students who are on the platform by the end of the window
  numberOfCompletedStudents: number; // Number of students who have completed the targets
  averageNumberOfQuestions: number; // Average number of questions attempted by the students
  studentsYetToJoin: UserThatHasYetToJoin[];
  studentsWithIncompleteWindow: UserWithWindowData[];
  studentsWithCompletedWindow: UserWithWindowData[];
  nonStudents: UserWithWindowData[];
}

export type AdminStatsEntity = AdminStatWindow[];
