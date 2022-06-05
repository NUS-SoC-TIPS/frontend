import { ReactElement } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCardSkeleton } from 'components/card';

import { InterviewsPage } from './InterviewsPage';

export const InterviewsSkeleton = (): ReactElement<typeof InterviewsPage> => {
  return (
    <InterviewsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </SimpleGrid>
      <StatCardSkeleton />
    </InterviewsPage>
  );
};
