import { InterviewBase } from './interviews';
import { SubmissionBase } from './questions';
import { StudentBase } from './students';
import { UserBase } from './users';
import { WindowBase } from './windows';

export interface CreateExclusionDto {
  userId: string;
  windowId: number;
  reason: string;
}

export interface CreateStudentDto {
  githubUsername: string;
  coursemologyName: string;
  coursemologyProfileUrl: string;
}

export interface CreateCohortDto {
  name: string;
  coursemologyUrl: string;
}

export interface CreateUpdateCohortDto {
  id: number | null;
  name: string;
  coursemologyUrl: string;
  windows: CreateUpdateWindowDto[];
}

export interface CreateUpdateWindowDto {
  id: number | null;
  numQuestions: number;
  requireInterview: boolean;
  startAt: Date;
  endAt: Date;
}

export interface AdminOverview {
  cohorts: {
    id: number;
    name: string;
    numStudents: number;
    startAt: Date | null;
    endAt: Date | null;
  }[];
  // TODO: Think about whether we want to paginate the list of non-students
  nonStudents: (UserBase & {
    joinedAt: Date;
  })[];
}

export interface CohortAdminItem {
  name: string;
  coursemologyUrl: string;
  windows: WindowBase[];
  // TODO: Remove this later once a separate query is done
  students: (StudentBase & {
    studentId: number;
    joinedAt: Date;
    coursemologyName: string;
    isExcluded: boolean;
  })[];
}

export interface CohortStudentValidationResult {
  success: (StudentBase & {
    coursemologyName: string;
  })[];
  error: {
    githubUsername: string;
    coursemologyName: string;
    coursemologyProfileUrl: string;
    error: 'ALREADY ADDED' | 'NOT FOUND' | 'INVALID DATA';
  }[];
}

export interface WindowItem extends WindowBase {
  students: (StudentBase & {
    studentId: number;
    coursemologyName: string;
    submissions: SubmissionBase[];
    interviews: InterviewBase[];
    exclusion: {
      id: number;
      reason: string; // TODO: Make this an enum
    } | null;
  })[];
}
