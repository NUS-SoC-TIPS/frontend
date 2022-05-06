import { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react';

import { Page } from 'components/page';

import { Hero } from './Hero';

export const Landing = (): ReactElement => {
  return (
    <Page>
      <Stack spacing={{ base: '8', lg: '6' }}>
        <Hero />
      </Stack>
    </Page>
  );
};
