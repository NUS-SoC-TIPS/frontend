import { ReactElement } from 'react';
import { FormControl, FormLabel, Stack } from '@chakra-ui/react';

import { Select } from 'components/select';
import { Language } from 'types/models/code';
import { Question, QuestionType } from 'types/models/question';

interface Props {
  question: Question;
  onChangeLanguage: (language: Language | null) => void;
}

const algorithmLanguages: { [key: string]: string } = {
  [Language.C_PLUS_PLUS]: 'C++',
  [Language.JAVA]: 'Java',
  [Language.PYTHON]: 'Python',
  [Language.PYTHON_THREE]: 'Python 3',
  [Language.C]: 'C',
  [Language.C_SHARP]: 'C#',
  [Language.JAVASCRIPT]: 'JavaScript',
  [Language.RUBY]: 'Ruby',
  [Language.SWIFT]: 'Swift',
  [Language.GO]: 'Go',
  [Language.SCALA]: 'Scala',
  [Language.KOTLIN]: 'Kotlin',
  [Language.RUST]: 'Rust',
  [Language.PHP]: 'PHP',
  [Language.TYPESCRIPT]: 'TypeScript',
  [Language.RACKET]: 'Racket',
  [Language.ERLANG]: 'Erlang',
  [Language.ELIXIR]: 'Elixir',
};

const databaseLanguages: { [key: string]: string } = {
  [Language.MY_SQL]: 'MySQL',
  [Language.MS_SQL_SERVER]: 'MS SQL Server',
  [Language.ORACLE]: 'Oracle',
};

const shellLanguages: { [key: string]: string } = {
  [Language.BASH]: 'Bash',
};

const concurrencyLanguages: { [key: string]: string } = {
  [Language.C_PLUS_PLUS]: 'C++',
  [Language.JAVA]: 'Java',
  [Language.PYTHON]: 'Python',
  [Language.PYTHON_THREE]: 'Python 3',
  [Language.C]: 'C',
  [Language.C_SHARP]: 'C#',
};

interface LanguageOption {
  label: string;
  value: Language;
}

export const LanguageFormControl = ({
  question,
  onChangeLanguage,
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
    return Object.entries(languages).map(([value, label]) => ({
      label,
      value: value as Language,
    }));
  };

  const onChangeWrapper = (language: unknown): void => {
    onChangeLanguage(language ? (language as LanguageOption).value : null);
  };

  return (
    <FormControl id="language">
      <Stack
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        spacing={{ base: '1.5', md: '8' }}
      >
        <FormLabel variant="inline">Language Used</FormLabel>
        <Select
          containerStyles={{ maxW: { md: '3xl' } }}
          onChange={onChangeWrapper}
          options={getOptions()}
          placeholder="Select language used..."
        />
      </Stack>
    </FormControl>
  );
};
