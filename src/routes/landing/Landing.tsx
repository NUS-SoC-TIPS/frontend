import { ReactElement } from 'react';
import { Stack, useToast } from '@chakra-ui/react';

import { Page } from 'components/page';
import { ERROR_TOAST_PROPS } from 'constants/toast';
import { useAuth } from 'contexts/AuthContext';

import { Hero } from './Hero';

export const Landing = (): ReactElement<typeof Page> => {
  const { login, loginDev, isLoggingIn } = useAuth();
  const toast = useToast();

  const onGetStarted = async (): Promise<void> => {
    login().catch(() => toast(ERROR_TOAST_PROPS));
  };

  const onDevelopmentLogin = async (): Promise<void> => {
    loginDev().catch(() => toast(ERROR_TOAST_PROPS));
  };

  return (
    <Page>
      <Stack spacing={{ base: 8, lg: 6 }}>
        <Hero
          isGettingStarted={isLoggingIn}
          onDevelopmentLogin={onDevelopmentLogin}
          onGetStarted={onGetStarted}
        />
      </Stack>
    </Page>
  );
};
