import { User } from 'types/models/user';
import { Window } from 'types/models/window';

export interface UserThatHasYetToJoin {
  name: string;
  githubUsername: string;
  email: string;
  coursemologyProfile: string;
}

export interface UserWithWindowData extends User {
  email: string;
  coursemologyProfile: string;
  numQuestions: number;
  numInterviews: number;
  hasCompletedSubmissions: boolean;
  hasCompletedInterview: boolean;
}

// If a user joins only in window 2, they will be present in
// window 2's stats but under "yet to join" in window 1.
export interface AdminStatWindow extends Window {
  numStudents: number; // Number of students who are on the platform by the end of the window
  numStudentsCompleted: number; // Number of students who have completed the targets
  avgNumQuestions: number; // Average number of questions attempted by the students
  studentsYetToJoin: UserThatHasYetToJoin[];
  studentsWithIncompleteWindow: UserWithWindowData[];
  studentsWithCompletedWindow: UserWithWindowData[];
  nonStudents: UserWithWindowData[];
}

export type AdminStats = AdminStatWindow[];
