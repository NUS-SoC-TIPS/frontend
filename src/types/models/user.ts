export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  githubUsername: string;
  photoUrl: string;
  profileUrl: string;
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

export interface UserSettingsConfig extends User {
  settings: Settings | null;
  config: AppConfig;
}
