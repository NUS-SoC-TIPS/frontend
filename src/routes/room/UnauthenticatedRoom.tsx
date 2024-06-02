import { ReactElement } from 'react';
import { Button, Text, useToast } from '@chakra-ui/react';

import { GitHubIcon } from '@/components/icons/GitHubIcon';
import { Modal } from '@/components/modal';
import { ERROR_TOAST_PROPS } from '@/constants/toast';
import { useAuth } from '@/contexts/AuthContext';

import { RoomPage } from './RoomPage';

export const UnauthenticatedRoom = (): ReactElement<typeof RoomPage> => {
  const { login, isLoggingIn } = useAuth();
  const toast = useToast();

  const onLogin = async (): Promise<void> => {
    login().catch(() => toast(ERROR_TOAST_PROPS));
  };

  return (
    <RoomPage>
      <Modal
        isOpen={true}
        onClose={(): void => undefined}
        showActions={false}
        textAlignCentre={true}
        title="Login now to get started with your mock interviews!"
      >
        <Text color="fg.muted">
          No worries, it&apos;s quick and painless to get started with TIPS!
        </Text>
        <Button
          fontSize="md"
          fontWeight="bold"
          iconSpacing={3}
          isLoading={isLoggingIn}
          leftIcon={<GitHubIcon boxSize={5} />}
          mt={4}
          onClick={onLogin}
          px={8}
          size="lg"
          variant="primary"
          width="full"
        >
          Get started with GitHub
        </Button>
      </Modal>
    </RoomPage>
  );
};
