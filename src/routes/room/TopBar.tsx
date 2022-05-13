import { ReactElement, useState } from 'react';
import {
  Box,
  Button,
  Container,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

import { useAppDispatch } from 'app/hooks';
import { ROOM } from 'constants/routes';
import { SITE_URL } from 'constants/urls';
import { setLanguage } from 'reducers/codeReducer';
import { Language } from 'types/models/code';

import { LanguagePopover } from './LanguagePopover';

interface Props {
  slug: string;
  language: Language;
}

export const TopBar = ({
  slug,
  language,
}: Props): ReactElement<Props, typeof Box> => {
  const dispatch = useAppDispatch();
  const [hasCopied, setHasCopied] = useState(false);

  const onCopyInviteLink = async (): Promise<void> => {
    await navigator.clipboard.writeText(`${SITE_URL}${ROOM}/${slug}`);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 1000);
  };

  return (
    <Box
      as="nav"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxWidth="100%" px={2} py={2}>
        <HStack justify="space-between" spacing="10">
          <Box>
            <LanguagePopover
              language={language}
              setLanguage={(newLanguage: Language): void => {
                dispatch(setLanguage(newLanguage));
              }}
            />
          </Box>
          <Button
            disabled={hasCopied}
            onClick={onCopyInviteLink}
            size="sm"
            variant="primary"
          >
            {hasCopied ? 'Copied!' : 'Copy Invite'}
          </Button>
        </HStack>
      </Container>
    </Box>
  );
};
