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

export interface Settings {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  hasUpdatedName: boolean;
  hasUpdatedPhoto: boolean;
}

export interface AppConfig {
  coursemology: string;
}

export interface UserWithSettingsAndConfig extends User {
  settings: Settings | null;
  config: AppConfig;
}
