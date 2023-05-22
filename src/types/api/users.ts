import { KeyBinding, Language } from 'types/models/code';
import { UserRole } from 'types/models/user';

// This is the minimal information needed by the frontend to
// render the user card element.
export interface UserBase {
  name: string;
  githubUsername: string;
  profileUrl: string;
  photoUrl: string;
}

export interface UserSelf extends UserBase {
  id: string;
  role: UserRole;
  isStudent: boolean;
  preferredInterviewLanguage: Language | null;
  preferredKeyBinding: KeyBinding;
}

export interface UpdateSettingsDto {
  name: string;
  photoUrl: string;
  preferredInterviewLanguage: Language | null;
  preferredKeyBinding: KeyBinding;
}
