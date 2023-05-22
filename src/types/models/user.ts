export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  githubUsername: string;
  photoUrl: string;
  profileUrl: string;
  role: UserRole;
}

export enum UserRole {
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN',
}
