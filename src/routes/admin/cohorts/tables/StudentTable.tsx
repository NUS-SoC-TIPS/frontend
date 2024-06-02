import { ReactElement, ReactNode, useMemo } from 'react';
import { Box, Button, Link } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { UserProfile } from '@/components/userProfile';
import { StudentBaseWithId } from '@/types/api/students';
import { UserBase } from '@/types/api/users';
import { TableColumn } from '@/types/table';
import { formatDateWithYear } from '@/utils/dateUtils';
import {
  compareBooleansTrueFirst,
  compareDatesAscending,
  compareNamesAscending,
} from '@/utils/sortUtils';
import { booleanRenderer } from '@/utils/tableUtils';

interface Props {
  students: (StudentBaseWithId & {
    joinedAt: Date;
    isExcluded: boolean;
  })[];
  onAdd: () => void;
}

interface Row {
  user: UserBase;
  name: string;
  githubUsername: string;
  coursemologyProfile: {
    name: string;
    url: string;
  };
  coursemologyName: string;
  joinedAt: Date;
  isExcluded: boolean;
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
      label: 'Coursemology Profile',
      key: 'coursemologyProfile',
      options: {
        customBodyRenderer: (profile: {
          name: string;
          url: string;
        }): ReactNode => (
          <Box>
            <Link
              color="fg.emphasized"
              fontSize="sm"
              fontWeight="medium"
              href={profile.url}
              isExternal={true}
              noOfLines={1}
              textAlign="left"
            >
              {profile.name}
            </Link>
          </Box>
        ),
        isVisible: true,
        isSearchable: false,
        isDownloadable: false,
        isSortable: true,
        customSortComparator: compareNamesAscending,
      },
    },
    {
      label: 'Coursemology Name',
      key: 'coursemologyName',
      options: {
        isVisible: false,
        isSearchable: true,
        isDownloadable: true,
      },
    },
    {
      label: 'Coursemology Profile URL',
      key: 'coursemologyProfileUrl',
      options: {
        isVisible: false,
        isSearchable: false,
        isDownloadable: true,
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
    {
      label: 'Is Excluded',
      key: 'isExcluded',
      options: {
        customBodyRenderer: booleanRenderer,
        customSearchValueRenderer: booleanRenderer,
        customCsvBodyRenderer: booleanRenderer,
        customSortComparator: compareBooleansTrueFirst,
        isSortable: true,
      },
    },
  ];
};

const transformData = (
  students: (StudentBaseWithId & {
    joinedAt: Date;
    isExcluded: boolean;
  })[],
): Row[] => {
  return students.map((student) => {
    const {
      name,
      studentId,
      githubUsername,
      profileUrl,
      photoUrl,
      coursemologyName,
      coursemologyProfileUrl,
      isExcluded,
      joinedAt,
    } = student;

    return {
      studentId,
      user: {
        name,
        githubUsername,
        profileUrl,
        photoUrl,
      },
      name,
      githubUsername,
      coursemologyProfile: {
        name: coursemologyName,
        url: coursemologyProfileUrl,
      },
      coursemologyName,
      coursemologyProfileUrl,
      joinedAt,
      isExcluded,
    };
  });
};

export const StudentTable = ({
  students,
  onAdd,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);
  const rows = useMemo(() => transformData(students), [students]);

  return (
    <Card px={0} py={0}>
      <Table
        actionButton={
          <Button onClick={onAdd} variant="primary">
            Add Students
          </Button>
        }
        columns={columns}
        options={{
          title: 'Students',
          downloadFileName: 'Students',
        }}
        rows={rows}
      />
    </Card>
  );
};
