import { ReactElement, ReactNode, useMemo } from 'react';
import { Box, Link } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { UserProfile } from '@/components/userProfile';
import { StudentBase } from '@/types/api/students';
import { UserBase } from '@/types/api/users';
import { TableColumn } from '@/types/table';
import { compareNamesAscending } from '@/utils/sortUtils';

interface Props {
  students: StudentBase[];
  isCreated: boolean;
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
  ];
};

const transformData = (students: StudentBase[]): Row[] => {
  return students.map((student) => {
    const {
      name,
      githubUsername,
      profileUrl,
      photoUrl,
      coursemologyName,
      coursemologyProfileUrl,
    } = student;

    return {
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
    };
  });
};

export const CreatedStudentTable = ({
  students,
  isCreated,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);
  const rows = useMemo(() => transformData(students), [students]);

  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{
          title: isCreated ? 'Students Added' : 'Will be Added',
          downloadFileName: isCreated ? 'Students Added' : 'Will be Added',
        }}
        rows={rows}
      />
    </Card>
  );
};
