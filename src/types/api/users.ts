import { KeyBinding, Language } from 'types/models/code';

export interface UpdateSettingsDto {
  name: string;
  photoUrl: string;
  preferredInterviewLanguage: Language | null;
  preferredKeyBinding: KeyBinding;
}
