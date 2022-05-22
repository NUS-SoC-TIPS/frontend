import { ReactElement } from 'react';
import { Box, Link, Popover, Stack, Text } from '@chakra-ui/react';

import { MyPopover } from 'components/popover';
import { languageToString } from 'constants/enumStrings';
import { Language } from 'types/models/code';

interface Props {
  language: Language;
  setLanguage: (language: Language) => void;
}

const supportedLanguages = [
  Language.JAVA,
  Language.JAVASCRIPT,
  Language.PYTHON_THREE,
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
        minWidth: '32',
        display: 'flex',
        justifyContent: 'space-between',
      }}
      content={
        <Stack direction="column" spacing="1">
          {items.map((item, id) => (
            <Link key={id} onClick={item.onClick} variant="menu">
              <Box p="1">
                <Text fontSize="sm" fontWeight="medium">
                  {item.title}
                </Text>
              </Box>
            </Link>
          ))}
        </Stack>
      }
      popoverContentProps={{ p: 2, width: '32' }}
      trigger={languageToString[language]}
    />
  );
};
