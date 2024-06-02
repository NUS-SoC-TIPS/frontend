import { ReactElement, useCallback, useMemo } from 'react';

import { FormControl } from '@/components/formControl';
import { Select } from '@/components/select';
import { LANGUAGE_TO_STRING } from '@/constants/enumStrings';
import { INTERVIEW_LANGUAGES } from '@/constants/languages';
import { Language } from '@/types/models/code';

interface Props {
  onChangePreferredInterviewLanguage: (language: Language | null) => void;
  preferredInterviewLanguage: Language | null;
}

interface LanguageOption {
  label: string;
  value: Language;
}

export const LanguageFormControl = ({
  onChangePreferredInterviewLanguage,
  preferredInterviewLanguage,
}: Props): ReactElement<Props, typeof FormControl> => {
  const options: LanguageOption[] = useMemo(
    () =>
      INTERVIEW_LANGUAGES.map((language) => ({
        label: LANGUAGE_TO_STRING[language],
        value: language,
      })),
    [],
  );

  const onChangeWrapper = useCallback(
    (language: unknown): void => {
      onChangePreferredInterviewLanguage(
        language ? (language as LanguageOption).value : null,
      );
    },
    [onChangePreferredInterviewLanguage],
  );

  return (
    <FormControl id="language" label="Preferred Interview Language">
      <Select
        defaultValue={
          preferredInterviewLanguage
            ? {
                label: LANGUAGE_TO_STRING[preferredInterviewLanguage],
                value: preferredInterviewLanguage,
              }
            : undefined
        }
        onChange={onChangeWrapper}
        options={options}
        placeholder="Select your preferred language..."
      />
    </FormControl>
  );
};
