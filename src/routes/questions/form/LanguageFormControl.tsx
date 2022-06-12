import { ReactElement } from 'react';

import { FormControl } from 'components/formControl';
import { Select } from 'components/select';
import { languageToString } from 'constants/enumStrings';
import { Language } from 'types/models/code';
import { Question, QuestionType } from 'types/models/question';

interface Props {
  question: Question;
  onChangeLanguage: (language: Language | null) => void;
  defaultLanguage?: Language;
}

const algorithmLanguages: Language[] = [
  Language.C_PLUS_PLUS,
  Language.JAVA,
  Language.PYTHON,
  Language.PYTHON_THREE,
  Language.C,
  Language.C_SHARP,
  Language.JAVASCRIPT,
  Language.RUBY,
  Language.SWIFT,
  Language.GO,
  Language.SCALA,
  Language.KOTLIN,
  Language.RUST,
  Language.PHP,
  Language.TYPESCRIPT,
  Language.RACKET,
  Language.ERLANG,
  Language.ELIXIR,
];

const databaseLanguages: Language[] = [
  Language.MY_SQL,
  Language.MS_SQL_SERVER,
  Language.ORACLE,
];

const shellLanguages: Language[] = [Language.BASH];

const concurrencyLanguages: Language[] = [
  Language.C_PLUS_PLUS,
  Language.JAVA,
  Language.PYTHON,
  Language.PYTHON_THREE,
  Language.C,
  Language.C_SHARP,
];

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
    switch (question.type) {
      case QuestionType.ALGORITHMS:
        languages = algorithmLanguages;
        break;
      case QuestionType.DATABASE:
        languages = databaseLanguages;
        break;
      case QuestionType.CONCURRENCY:
        languages = concurrencyLanguages;
        break;
      case QuestionType.SHELL:
        languages = shellLanguages;
    }
    return languages.map((language) => ({
      label: languageToString[language],
      value: language,
    }));
  };

  const onChangeWrapper = (language: unknown): void => {
    onChangeLanguage(language ? (language as LanguageOption).value : null);
  };

  return (
    <FormControl id="language" label="Language Used">
      <Select
        defaultValue={
          defaultLanguage
            ? {
                label: languageToString[defaultLanguage],
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
