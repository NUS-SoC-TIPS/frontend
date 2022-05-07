import { ReactElement, useState } from 'react';
import { Stack } from '@chakra-ui/react';

import { Page } from 'components/page';
import { useAuth } from 'contexts/AuthContext';

import { Hero } from './Hero';

export const Landing = (): ReactElement => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();

  const handleGitHubLogin = async (): Promise<void> => {
    setIsLoggingIn(true);
    login().catch(() => {
      setIsLoggingIn(false);
    });
  };

  return (
    <Page>
      <Stack spacing={{ base: '8', lg: '6' }}>
        <Hero isGettingStarted={isLoggingIn} onGetStarted={handleGitHubLogin} />
      </Stack>
    </Page>
  );
};
