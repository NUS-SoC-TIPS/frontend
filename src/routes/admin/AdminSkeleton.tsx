import { ReactElement } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCardSkeleton } from 'components/card';

import { AdminPage } from './AdminPage';

export const AdminSkeleton = (): ReactElement<typeof AdminPage> => {
  return (
    <AdminPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </SimpleGrid>
      <StatCardSkeleton />
      <StatCardSkeleton />
    </AdminPage>
  );
};
