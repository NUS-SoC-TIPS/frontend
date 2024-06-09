import { ReactElement, ReactNode, useMemo } from 'react';
import { HiFilter } from 'react-icons/hi';
import { Button, HStack, Select, Text } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { UserProfile } from '@/components/userProfile';
import { ExcuseBase } from '@/types/api/excuses';
import { UserBase } from '@/types/api/users';
import { TableColumn } from '@/types/table';
import { compareNamesAscending } from '@/utils/sortUtils';

interface Props {
  excuses: ExcuseBase[];
  onView: (id: number) => void;
}

const getColumns = (onView: (id: number) => void): TableColumn[] => {
  return [
    {
      label: 'User',
      key: 'user',
      options: {
        customBodyRenderer: (user: UserBase): ReactNode => (
          <UserProfile ps={0} user={user} />
        ),
        isSearchable: false,
        isDownloadable: false,
        isSortable: true,
        customSortComparator: compareNamesAscending,
      },
    },
    {
      label: 'Excuse From',
      key: 'excuseFrom',
      options: {
        isSortable: true,
      },
    },
    {
      label: 'Excuse Reason',
      key: 'reason',
      options: {
        customBodyRenderer: (reason: string): ReactNode => (
          <div style={{ maxWidth: '225px' }}>
            <Text isTruncated={true}>{reason}</Text>
          </div>
        ),
        isSortable: true,
      },
    },
    {
      label: 'Status',
      key: 'status',
      options: {
        isSortable: true,
      },
    },
    {
      label: 'Actions',
      key: 'id',
      options: {
        customBodyRenderer: (id: number): ReactNode => (
          <Button onClick={(): void => onView(id)} variant="secondary">
            View
          </Button>
        ),
        isDownloadable: false,
        isSearchable: false,
        isVisible: true,
      },
    },
  ];
};

export const ExcuseTable = ({
  excuses,
  onView,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(onView), [onView]);

  return (
    <Card px={0} py={0}>
      <Table
        actionButton={
          <HStack spacing={2}>
            <HiFilter size={25} />
            <Select>
              <option value="all">All</option>
              <option value="pending">Pending Decision</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </HStack>
        }
        columns={columns}
        options={{
          title: 'Excuses',
          isDownloadable: false,
          numRowsPerPage: excuses.length,
        }}
        rows={excuses}
      />
    </Card>
  );
};
