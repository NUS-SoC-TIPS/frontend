import { ReactElement, ReactNode, useMemo } from 'react';

import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { UserProfile } from '@/components/userProfile';
import { UserBase } from '@/types/api/users';
import { TableColumn } from '@/types/table';
import { formatDateWithYear } from '@/utils/dateUtils';
import {
  compareDatesAscending,
  compareNamesAscending,
} from '@/utils/sortUtils';

interface Props {
  users: (UserBase & {
    joinedAt: Date;
  })[];
}

interface Row {
  user: UserBase;
  name: string;
  githubUsername: string;
  joinedAt: Date;
}

const getColumns = (): TableColumn[] => {
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
      label: 'Name',
      key: 'name',
      options: {
        isVisible: false,
      },
    },
    {
      label: 'GitHub Username',
      key: 'githubUsername',
      options: {
        isVisible: false,
      },
    },
    {
      label: 'Joined At (SGT)',
      key: 'joinedAt',
      options: {
        customBodyRenderer: formatDateWithYear,
        customSearchValueRenderer: formatDateWithYear,
        customCsvBodyRenderer: formatDateWithYear,
        customSortComparator: compareDatesAscending,
        isSortable: true,
      },
    },
  ];
};

const transformData = (
  users: (UserBase & {
    joinedAt: Date;
  })[],
): Row[] => {
  return users.map((user) => ({
    user: {
      name: user.name,
      githubUsername: user.githubUsername,
      profileUrl: user.profileUrl,
      photoUrl: user.photoUrl,
    },
    name: user.name,
    githubUsername: user.githubUsername,
    joinedAt: user.joinedAt,
  }));
};

export const NonStudentTable = ({
  users,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);
  const rows = useMemo(() => transformData(users), [users]);
  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{
          title: 'Non-Students',
          downloadFileName: 'Non-Students',
        }}
        rows={rows}
      />
    </Card>
  );
};
