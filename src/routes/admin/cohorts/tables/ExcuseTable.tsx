import { ReactElement, ReactNode, useCallback, useMemo, useState } from 'react';
import { HiFilter } from 'react-icons/hi';
import { Button, HStack, Select, Tag, Text } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { UserProfile } from '@/components/userProfile';
import { ExcuseBase } from '@/types/api/excuses';
import { UserBase } from '@/types/api/users';
import { WindowBase } from '@/types/api/windows';
import { ExcuseFrom, ExcuseStatus } from '@/types/models/excuse';
import { TableColumn } from '@/types/table';
import {
  compareDatesAscending,
  compareNamesAscending,
} from '@/utils/sortUtils';

const getExcuseFromTags = (e: ExcuseFrom): string[] => {
  switch (e) {
    case ExcuseFrom.QUESTION:
      return ['QUESTION'];
    case ExcuseFrom.INTERVIEW:
      return ['INTERVIEW'];
    case ExcuseFrom.INTERVIEW_AND_QUESTION:
      return ['QUESTION', 'INTERVIEW'];
    default:
      return [];
  }
};

interface Props {
  excuses: ExcuseBase[];
  windows: WindowBase[];
  onView: (id: number) => void;
}

const getColumns = (
  onView: (id: number) => void,
  getWindowNumber: (w: WindowBase) => number,
): TableColumn[] => {
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
      label: 'Window',
      key: 'window',
      options: {
        customBodyRenderer: (window: WindowBase): ReactNode => (
          <Text>{`Window ${getWindowNumber(window)}`}</Text>
        ),
        isSortable: true,
        customSortComparator: (a, b) =>
          compareDatesAscending(a.startAt, b.startAt),
      },
    },
    {
      label: 'Excuse From',
      key: 'excuseFrom',
      options: {
        customBodyRenderer: (excuseFrom: ExcuseFrom): ReactNode => {
          const tags = getExcuseFromTags(excuseFrom);
          return (
            <HStack spacing={2}>
              {tags.map((tag) => (
                <Tag
                  colorScheme={tag === ExcuseFrom.QUESTION ? 'gray' : 'purple'}
                  key={tag}
                >
                  {tag}
                </Tag>
              ))}
            </HStack>
          );
        },
        isSortable: true,
      },
    },
    {
      label: 'Excuse Reason',
      key: 'reason',
      options: {
        customBodyRenderer: (reason: string): ReactNode => (
          <div style={{ maxWidth: '150px' }}>
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
        customBodyRenderer: (status: ExcuseStatus): ReactNode => (
          <Tag
            colorScheme={
              status === ExcuseStatus.PENDING
                ? 'gray'
                : status === ExcuseStatus.ACCEPTED
                ? 'green'
                : 'red'
            }
          >
            {status}
          </Tag>
        ),
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
  windows,
}: Props): ReactElement<Props, typeof Card> => {
  const [filter, setFilter] = useState('all');
  const filteredExcuses = excuses.filter((excuse) => {
    switch (filter) {
      case 'pending':
        return excuse.status === ExcuseStatus.PENDING;
      case 'accepted':
        return excuse.status === ExcuseStatus.ACCEPTED;
      case 'rejected':
        return excuse.status === ExcuseStatus.REJECTED;
      default:
        return true;
    }
  });

  const sortedWindows = useMemo(
    () =>
      structuredClone(windows).sort((a, b) =>
        compareDatesAscending(a.startAt, b.startAt),
      ),
    [windows],
  );

  const getWindowNumber = useCallback(
    (window: WindowBase): number => {
      return sortedWindows.findIndex((w: WindowBase) => w.id === window.id) + 1;
    },
    [sortedWindows],
  );

  const columns = useMemo(
    () => getColumns(onView, getWindowNumber),
    [getWindowNumber, onView],
  );

  return (
    <Card px={0} py={0}>
      <Table
        actionButton={
          <HStack spacing={2}>
            <HiFilter size={25} />
            <Select
              onChange={(e): void => setFilter(e.target.value)}
              value={filter}
            >
              <option value="all">All</option>
              <option value="pending">Pending Decision</option>
              <option value="accepted">Accepted</option>
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
        rows={filteredExcuses}
      />
    </Card>
  );
};
