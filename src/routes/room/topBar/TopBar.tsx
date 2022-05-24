import { ReactElement, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from 'app/hooks';
import { ROOM } from 'constants/routes';
import { SITE_URL } from 'constants/urls';
import { updateLanguage } from 'lib/codeSocket';
import { Language } from 'types/models/code';

import { LanguagePopover } from './LanguagePopover';

interface Props {
  socket: Socket;
}

export const TopBar = ({ socket }: Props): ReactElement<Props, typeof Box> => {
  const params = useParams();
  const { language } = useAppSelector((state) => state.code);
  const [hasCopied, setHasCopied] = useState(false);

  const onCopyInviteLink = async (): Promise<void> => {
    await navigator.clipboard.writeText(`${SITE_URL}${ROOM}/${params.slug}`);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 1000);
  };

  const onChangeLanguage = (language: Language): void => {
    updateLanguage(socket, language);
  };

  return (
    <Box
      as="nav"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxWidth="100%" px={2} py={2}>
        <HStack justify="space-between" spacing={10}>
          <Box>
            <LanguagePopover
              language={language}
              setLanguage={onChangeLanguage}
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
