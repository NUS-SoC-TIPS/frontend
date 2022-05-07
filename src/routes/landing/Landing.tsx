import { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react';

import { Page } from 'components/page';
import { useAuth } from 'contexts/AuthContext';

import { Hero } from './Hero';

export const Landing = (): ReactElement => {
  const { login, isLoggingIn } = useAuth();

  return (
    <Page>
      <Stack spacing={{ base: '8', lg: '6' }}>
        <Hero isGettingStarted={isLoggingIn} onGetStarted={login} />
      </Stack>
    </Page>
  );
};
