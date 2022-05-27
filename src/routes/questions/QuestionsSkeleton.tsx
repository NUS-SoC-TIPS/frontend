import { ReactElement } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { QuestionsPage } from './QuestionsPage';
import { SkeletonStatCard } from './stats';

export const QuestionsSkeleton = (): ReactElement<typeof QuestionsPage> => {
  return (
    <QuestionsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </SimpleGrid>
      <SkeletonStatCard />
    </QuestionsPage>
  );
};
