import { ReactElement } from 'react';
import { Box, Link, Popover, Stack, Text } from '@chakra-ui/react';

import { MyPopover } from 'components/popover';
import { Language } from 'types/models/code';

interface Props {
  language: Language;
  setLanguage: (language: Language) => void;
}

const languageNames: { [key: string]: string } = {
  [Language.JAVA]: 'Java',
  [Language.JAVASCRIPT]: 'JavaScript',
  [Language.PYTHON]: 'Python 3',
};

export const LanguagePopover = ({
  language,
  setLanguage,
}: Props): ReactElement<Props, typeof Popover> | null => {
  const items = Object.entries(languageNames).map(([languageEnum, name]) => ({
    title: name,
    onClick: () => setLanguage(languageEnum as Language),
  }));

  return (
    <MyPopover
      buttonProps={{ variant: 'secondary' }}
      content={
        <Stack direction="column" spacing="2">
          {items.map((item, id) => (
            <Link key={id} onClick={item.onClick} variant="menu">
              <Box p="3">
                <Text fontWeight="medium">{item.title}</Text>
              </Box>
            </Link>
          ))}
        </Stack>
      }
      popoverContentProps={{ p: 3, width: '3xs' }}
      trigger={languageNames[language]}
    />
  );
};
