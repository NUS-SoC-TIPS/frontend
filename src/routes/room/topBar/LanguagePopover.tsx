import { ReactElement } from 'react';
import { Box, Link, Popover, SimpleGrid, Text } from '@chakra-ui/react';

import { MyPopover } from 'components/popover';
import { languageToString } from 'constants/enumStrings';
import { Language } from 'types/models/code';

interface Props {
  language: Language;
  setLanguage: (language: Language) => void;
}

const supportedLanguages = [
  Language.C,
  Language.C_PLUS_PLUS,
  Language.C_SHARP,
  Language.ELIXIR,
  Language.ERLANG,
  Language.GO,
  Language.JAVA,
  Language.JAVASCRIPT,
  Language.KOTLIN,
  Language.PHP,
  Language.PYTHON_THREE,
  Language.RUBY,
  Language.RUST,
  Language.SCALA,
  Language.SWIFT,
  Language.TYPESCRIPT,
];

export const LanguagePopover = ({
  language,
  setLanguage,
}: Props): ReactElement<Props, typeof Popover> | null => {
  const items = supportedLanguages.map((supportedLanguage) => ({
    title: languageToString[supportedLanguage],
    onClick: () => setLanguage(supportedLanguage),
  }));

  return (
    <MyPopover
      buttonProps={{
        variant: 'secondary',
        size: 'sm',
        minWidth: 32,
        display: 'flex',
        justifyContent: 'space-between',
      }}
      content={
        <SimpleGrid columnGap={3} columns={2} rowGap={2}>
          {items.map((item, id) => (
            <Link key={id} onClick={item.onClick} variant="menu">
              <Box p={1}>
                <Text fontSize="sm" fontWeight="medium" ps={1}>
                  {item.title}
                </Text>
              </Box>
            </Link>
          ))}
        </SimpleGrid>
      }
      popoverContentProps={{ p: 2, maxWidth: 64 }}
      trigger={languageToString[language]}
    />
  );
};
