import { ReactElement, ReactNode, useMemo } from 'react';
import { Box, Button, Link } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { UserWithWindowData } from 'types/api/admin';
import { Exclusion } from 'types/models/exclusion';
import { User } from 'types/models/user';
import { TableColumn, TableOptions } from 'types/table';
import { emptyFunction } from 'utils/functionUtils';
import {
  compareBooleansTrueFirst,
  compareNamesAscending,
} from 'utils/sortUtils';

interface Props {
  users: UserWithWindowData[];
  usersAreStudents?: boolean;
  options?: TableOptions;
  isInclude?: boolean;
  onIncludeOrExclude?: (id: string) => void;
}

interface Row {
  id: string;
  user: User;
  name: string;
  githubUsername: string;
  coursemologyProfile: {
    name: string;
    link: string;
    email: string;
  };
  coursemologyName: string;
  coursemologyEmail: string;
  numberOfQuestions: number;
  numberOfInterviews: number;
  hasCompletedWindow: boolean;
  coursemologyProfileLink: string;
  exclusion?: Exclusion;
}

const getColumns = (
  usersAreStudents: boolean,
  isInclude: boolean,
  onIncludeOrExclude: (id: string) => void,
): TableColumn[] => {
  return [
    {
      label: 'User',
      key: 'user',
      options: {
        customBodyRenderer: (user: User): ReactNode => (
          <UserProfile ps={0} user={user} />
        ),
        customSearchValueRenderer: (user: User) =>
          `${user.name} ${user.githubUsername}`,
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
        isSearchable: false,
      },
    },
    {
      label: 'GitHub Username',
      key: 'githubUsername',
      options: {
        isVisible: false,
        isSearchable: false,
      },
    },
    {
      label: 'Coursemology Profile',
      key: 'coursemologyProfile',
      options: {
        customBodyRenderer: (profile: {
          name: string;
          link: string;
          email: string;
        }): ReactNode => (
          <Box>
            <Link
              color="emphasized"
              fontSize="sm"
              fontWeight="medium"
              href={profile.link}
              isExternal={true}
              noOfLines={1}
              textAlign="left"
            >
              {profile.name}
            </Link>
            <Link
              color="muted"
              fontSize="sm"
              href={`mailto:${profile.email}`}
              isExternal={true}
              noOfLines={1}
              textAlign="left"
            >
              {profile.email}
            </Link>
          </Box>
        ),
        isVisible: usersAreStudents,
        isSearchable: usersAreStudents,
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
        isSearchable: false,
        isDownloadable: usersAreStudents,
      },
    },
    {
      label: 'Coursemology Email',
      key: 'coursemologyEmail',
      options: {
        isVisible: false,
        isSearchable: false,
        isDownloadable: usersAreStudents,
      },
    },
    {
      label: 'Coursemology Profile Link',
      key: 'coursemologyProfileLink',
      options: {
        isVisible: false,
        isSearchable: false,
        isDownloadable: usersAreStudents,
      },
    },
    {
      label: 'Number of Questions',
      key: 'numberOfQuestions',
      options: {
        customBodyRenderer: (numQuestions: number): ReactNode => numQuestions,
        customCsvHeaderRenderer: (): string => 'Number of Questions Completed',
        isSortable: true,
      },
    },
    {
      label: 'Number of Interviews',
      key: 'numberOfInterviews',
      options: {
        isSortable: true,
      },
    },
    {
      label: 'Completed Window',
      key: 'hasCompletedWindow',
      options: {
        customBodyRenderer: (hasCompletedWindow: boolean) =>
          hasCompletedWindow ? 'Yes' : 'No',
        isSortable: true,
        customSortComparator: compareBooleansTrueFirst,
        customCsvBodyRenderer: (hasCompletedWindow: boolean) =>
          hasCompletedWindow ? 'Yes' : 'No',
      },
    },
    {
      label: 'Reason for Exclusion',
      key: 'exclusion',
      options: {
        customBodyRenderer: (exclusion: Exclusion | undefined) =>
          exclusion?.reason ?? '-',
        isVisible: isInclude,
        isDownloadable: isInclude,
        isSearchable: isInclude,
      },
    },
    {
      label: 'Actions',
      key: 'id',
      options: {
        customBodyRenderer: (id: string): ReactNode => (
          <Button
            onClick={(): void => {
              onIncludeOrExclude(id);
            }}
            variant="secondary"
          >
            {isInclude ? 'Include' : 'Exclude'}
          </Button>
        ),
        isDownloadable: false,
        isSearchable: false,
        isVisible: usersAreStudents,
      },
    },
  ];
};

const transformData = (
  users: (UserWithWindowData & { exclusion?: Exclusion })[],
): Row[] => {
  return users.map((user) => {
    const {
      numberOfQuestions,
      numberOfInterviews,
      hasCompletedWindow,
      coursemologyName,
      coursemologyEmail,
      coursemologyProfileLink,
      exclusion,
      ...userData
    } = user;
    return {
      id: user.id,
      user: userData,
      name: user.name,
      githubUsername: user.githubUsername,
      coursemologyProfile: {
        name: coursemologyName,
        link: coursemologyProfileLink,
        email: coursemologyEmail,
      },
      coursemologyName,
      coursemologyEmail,
      numberOfQuestions,
      numberOfInterviews,
      hasCompletedWindow,
      coursemologyProfileLink,
      exclusion,
    };
  });
};

export const UserTable = ({
  users,
  usersAreStudents = true,
  isInclude = false,
  options = {},
  onIncludeOrExclude = emptyFunction,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(
    () => getColumns(usersAreStudents, isInclude, onIncludeOrExclude),
    [usersAreStudents, isInclude, onIncludeOrExclude],
  );
  const rows = useMemo(() => transformData(users), [users]);

  return (
    <Card px={0} py={0}>
      <Table columns={columns} options={options} rows={rows} />
    </Card>
  );
};
