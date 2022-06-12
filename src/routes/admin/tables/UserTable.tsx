import { ReactElement, ReactNode, useMemo } from 'react';
import { Button, Link, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { UserWithWindowData } from 'types/api/admin';
import { User } from 'types/models/user';
import { TableColumn, TableOptions } from 'types/table';
import { compareNamesAscending } from 'utils/sortUtils';

interface Props {
  users: UserWithWindowData[];
  showEmail?: boolean;
  showCoursemology?: boolean;
  options?: TableOptions;
}

interface Row {
  user: User;
  name: string;
  githubUsername: string;
  coursemologyName: string;
  coursemologyEmail: string;
  numberOfQuestions: number;
  numberOfInterviews: number;
  hasCompletedInterview: boolean;
  coursemologyProfileLink: string;
}

const getColumns = (
  showEmail: boolean,
  showCoursemology: boolean,
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
      label: 'Coursemology Name',
      key: 'coursemologyName',
      options: {
        isVisible: showCoursemology,
        isSearchable: showCoursemology,
        isSortable: true,
      },
    },
    {
      label: 'Coursemology Email',
      key: 'coursemologyEmail',
      options: {
        customBodyRenderer: (email: string): ReactNode => (
          <Text color="muted">
            <Link href={`mailto:${email}`}>{email}</Link>
          </Text>
        ),
        isVisible: showEmail,
        isSearchable: showEmail,
        isDownloadable: showEmail,
        isSortable: true,
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
      label: 'Coursemology',
      key: 'coursemologyProfileLink',
      options: {
        customBodyRenderer: (coursemologyProfileLink: string): ReactNode => (
          <Button
            onClick={(): void => {
              window.open(coursemologyProfileLink);
            }}
            variant="secondary"
          >
            View Profile
          </Button>
        ),
        customCsvHeaderRenderer: (): string => 'Coursemology Profile Link',
        isVisible: showCoursemology,
        isDownloadable: showCoursemology,
        isSearchable: false,
      },
    },
  ];
};

const transformData = (users: UserWithWindowData[]): Row[] => {
  return users.map((user) => {
    const {
      numberOfQuestions,
      numberOfInterviews,
      hasCompletedInterview,
      coursemologyName,
      coursemologyEmail,
      coursemologyProfileLink,
      ...userData
    } = user;
    return {
      user: userData,
      name: user.name,
      githubUsername: user.githubUsername,
      coursemologyName,
      coursemologyEmail,
      numberOfQuestions,
      numberOfInterviews,
      hasCompletedInterview,
      coursemologyProfileLink,
    };
  });
};

export const UserTable = ({
  users,
  showEmail = true,
  showCoursemology = true,
  options = {},
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(
    () => getColumns(showEmail, showCoursemology),
    [showEmail, showCoursemology],
  );
  const rows = useMemo(() => transformData(users), [users]);

  return (
    <Card px={0} py={0}>
      <Table columns={columns} options={options} rows={rows} />
    </Card>
  );
};
