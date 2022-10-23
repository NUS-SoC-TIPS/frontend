import { ReactElement, useCallback } from 'react';

import { FormControl } from 'components/formControl';
import { Select } from 'components/select';
import { LANGUAGE_TO_STRING } from 'constants/enumStrings';
import {
  ALGORITHM_LANGUAGES,
  CONCURRENCY_LANGUAGES,
  DATABASE_LANGUAGES,
  KATTIS_LANGUAGES,
  SHELL_LANGUAGES,
} from 'constants/languages';
import { Language } from 'types/models/code';
import { Question, QuestionSource, QuestionType } from 'types/models/question';

interface Props {
  question: Question;
  onChangeLanguage: (language: Language | null) => void;
  defaultLanguage?: Language;
}

interface LanguageOption {
  label: string;
  value: Language;
}

export const LanguageFormControl = ({
  question,
  onChangeLanguage,
  defaultLanguage,
}: Props): ReactElement<Props, typeof FormControl> => {
  const getOptions = (): LanguageOption[] => {
    let languages;
    switch (question.source) {
      case QuestionSource.KATTIS:
        languages = KATTIS_LANGUAGES;
        break;
      default:
        switch (question.type) {
          case QuestionType.ALGORITHMS:
            languages = ALGORITHM_LANGUAGES;
            break;
          case QuestionType.DATABASE:
            languages = DATABASE_LANGUAGES;
            break;
          case QuestionType.CONCURRENCY:
            languages = CONCURRENCY_LANGUAGES;
            break;
          case QuestionType.SHELL:
            languages = SHELL_LANGUAGES;
        }
    }
    return languages.map((language) => ({
      label: LANGUAGE_TO_STRING[language],
      value: language,
    }));
  };

  const onChangeWrapper = useCallback(
    (language: unknown): void => {
      onChangeLanguage(language ? (language as LanguageOption).value : null);
    },
    [onChangeLanguage],
  );

  return (
    <FormControl id="language" label="Language Used">
      <Select
        defaultValue={
          defaultLanguage
            ? {
                label: LANGUAGE_TO_STRING[defaultLanguage],
                value: defaultLanguage,
              }
            : undefined
        }
        onChange={onChangeWrapper}
        options={getOptions()}
        placeholder="Select language used..."
      />
    </FormControl>
  );
};
