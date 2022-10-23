import { Language } from 'types/models/code';

export class UpdateSettingsDto {
  name?: string;
  photoUrl?: string;
  preferredInterviewLanguage?: Language | null;
}
