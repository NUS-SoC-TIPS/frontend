import { ReactElement } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCardSkeleton } from 'components/card';

import { ViewWindowPage } from './ViewWindowPage';

export const ViewWindowSkeleton = (): ReactElement<typeof ViewWindowPage> => {
  return (
    <ViewWindowPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCardSkeleton />
        <StatCardSkeleton />
      </SimpleGrid>
      <StatCardSkeleton />
      <StatCardSkeleton />
    </ViewWindowPage>
  );
};
