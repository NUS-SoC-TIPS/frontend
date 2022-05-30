import { ReactElement, ReactNode, useMemo } from 'react';
import { Button, Link, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { UserWithWindowData } from 'types/api/stats/admin';
import { User } from 'types/models/user';
import { Window } from 'types/models/window';
import { TableColumn, TableOptions } from 'types/table';

import { Completion } from './Completion';

interface Props {
  users: UserWithWindowData[];
  window: Window;
  showEmail?: boolean;
  showCoursemology?: boolean;
  showRawCount?: boolean;
  options?: TableOptions;
}

interface Row {
  user: User;
  name: string;
  githubUsername: string;
  email: string;
  numQuestions: number;
  numInterviews: number;
  hasCompletedInterview: boolean;
  coursemologyProfile: string;
}

const getColumns = (
  tipsWindow: Window,
  showEmail: boolean,
  showCoursemology: boolean,
  showRawCount: boolean,
): TableColumn[] => {
  return [
    {
      label: 'User',
      key: 'user',
      options: {
        customBodyRenderer: (user: User): ReactNode => (
          <UserProfile user={user} />
        ),
        isDownloadable: false,
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
      label: 'Email',
      key: 'email',
      options: {
        customBodyRenderer: (email: string): ReactNode => (
          <Text color="muted">
            <Link href={`mailto:${email}`}>{email}</Link>
          </Text>
        ),
        isVisible: showEmail,
        isDownloadable: showEmail,
      },
    },
    {
      label: showRawCount ? 'Number of Questions' : 'Questions',
      key: 'numQuestions',
      options: {
        customBodyRenderer: (numQuestions: number): ReactNode =>
          showRawCount ? (
            numQuestions
          ) : (
            <Completion
              defaultValue={Math.min(numQuestions, tipsWindow.numQuestions)}
              max={tipsWindow.numQuestions}
            />
          ),
        customCsvHeaderRenderer: (): string => 'Number of Questions Completed',
      },
    },
    {
      label: 'Interviews',
      key: 'hasCompletedInterview',
      options: {
        customBodyRenderer: (hasCompletedInterview: boolean): ReactNode =>
          tipsWindow.requireInterview ? (
            <Completion defaultValue={hasCompletedInterview ? 1 : 0} max={1} />
          ) : (
            <Text color="muted">-</Text>
          ),
        customCsvHeaderRenderer: (): string => 'Interview Completed',
        customCsvBodyRenderer: (hasCompletedInterview: boolean): string =>
          hasCompletedInterview ? 'Yes' : 'No',
        isVisible: !showRawCount,
        isDownloadable: !showRawCount,
      },
    },
    {
      label: 'Number of Interviews',
      key: 'numInterviews',
      options: {
        isVisible: showRawCount,
        isDownloadable: showRawCount,
      },
    },
    {
      label: 'Coursemology',
      key: 'coursemologyProfile',
      options: {
        customBodyRenderer: (coursemologyProfile: string): ReactNode => (
          <Button
            onClick={(): void => {
              window.open(coursemologyProfile);
            }}
            variant="secondary"
          >
            View Profile
          </Button>
        ),
        customCsvHeaderRenderer: (): string => 'Coursemology Profile Link',
        isVisible: showCoursemology,
        isDownloadable: showCoursemology,
      },
    },
  ];
};

const transformData = (users: UserWithWindowData[]): Row[] => {
  return users.map((user) => {
    const {
      email,
      numQuestions,
      numInterviews,
      hasCompletedInterview,
      coursemologyProfile,
      ...userData
    } = user;
    return {
      user: userData,
      name: user.name,
      githubUsername: user.githubUsername,
      email,
      numQuestions,
      numInterviews,
      hasCompletedInterview,
      coursemologyProfile,
    };
  });
};

export const UserTable = ({
  users,
  window,
  showEmail = true,
  showCoursemology = true,
  showRawCount = false,
  options = {},
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(
    () => getColumns(window, showEmail, showCoursemology, showRawCount),
    [window, showEmail, showCoursemology, showRawCount],
  );
  const rows = useMemo(() => transformData(users), [users]);

  return (
    <Card px={0} py={0}>
      <Table columns={columns} options={options} rows={rows} />
    </Card>
  );
};
