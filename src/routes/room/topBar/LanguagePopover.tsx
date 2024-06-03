import { ReactElement } from 'react';
import { Button, Popover, SimpleGrid } from '@chakra-ui/react';

import { MyPopover } from '@/components/popover';
import { LANGUAGE_TO_STRING } from '@/constants/enumStrings';
import { INTERVIEW_LANGUAGES } from '@/constants/languages';
import { Language } from '@/types/models/code';

interface Props {
  language: Language;
  setLanguage: (language: Language) => void;
  isDisabled?: boolean;
}

export const LanguagePopover = ({
  language,
  setLanguage,
  isDisabled = false,
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
        <SimpleGrid columnGap={1} columns={2} rowGap={1}>
          {items.map((item, id) => (
            <Button
              border="none"
              fontSize="sm"
              fontWeight="medium"
              isActive={language === item.value}
              justifyContent="flex-start"
              key={id}
              onClick={item.onClick}
              size="xs"
              variant="secondary"
            >
              {item.title}
            </Button>
          ))}
        </SimpleGrid>
      }
      isDisabled={isDisabled}
      popoverContentProps={{ p: 1, maxWidth: 64, ms: 2 }}
      trigger={LANGUAGE_TO_STRING[language]}
    />
  );
};
