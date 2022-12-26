import { ReactElement } from 'react';
import { Box, Link, Popover, SimpleGrid, Text } from '@chakra-ui/react';

import { MyPopover } from 'components/popover';
import { LANGUAGE_TO_STRING } from 'constants/enumStrings';
import { INTERVIEW_LANGUAGES } from 'constants/languages';
import { Language } from 'types/models/code';

interface Props {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const LanguagePopover = ({
  language,
  setLanguage,
}: Props): ReactElement<Props, typeof Popover> | null => {
  const items = INTERVIEW_LANGUAGES.map((supportedLanguage) => ({
    title: LANGUAGE_TO_STRING[supportedLanguage],
    onClick: () => setLanguage(supportedLanguage),
    value: supportedLanguage,
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
            <Link
              backgroundColor={
                language === item.value ? 'bg-subtle' : undefined
              }
              key={id}
              onClick={item.onClick}
              variant="menu"
            >
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
      trigger={LANGUAGE_TO_STRING[language]}
    />
  );
};
