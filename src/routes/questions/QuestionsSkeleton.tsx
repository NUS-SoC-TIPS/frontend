import { ReactElement } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCardSkeleton } from 'components/card';

import { QuestionsPage } from './QuestionsPage';

export const QuestionsSkeleton = (): ReactElement<typeof QuestionsPage> => {
  return (
    <QuestionsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </SimpleGrid>
      <StatCardSkeleton />
    </QuestionsPage>
  );
};
