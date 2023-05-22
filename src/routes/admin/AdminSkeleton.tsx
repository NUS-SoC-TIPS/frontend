import { ReactElement } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCardSkeleton } from 'components/card';

import { AdminPage } from './AdminPage';

interface Props {
  selectedIndex: number;
  windows: Window[];
}

export const AdminSkeleton = ({
  selectedIndex,
  windows,
}: Props): ReactElement<Props, typeof AdminPage> => {
  return (
    <AdminPage selectedIndex={selectedIndex} windows={windows}>
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
