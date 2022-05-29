import { ReactElement, ReactNode, useMemo } from 'react';
import { Button, Link, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { UserWithIncompleteWindow } from 'types/api/stats/admin';
import { User } from 'types/models/user';
import { Window } from 'types/models/window';
import { TableColumn } from 'types/table';
import { formatDate } from 'utils/dateUtils';

import { Completion } from './Completion';

interface Props {
  users: UserWithIncompleteWindow[];
  window: Window;
}

interface Row {
  user: User;
  name: string;
  githubUsername: string;
  email: string;
  numQuestions: number;
  hasCompletedInterview: boolean;
  coursemologyProfile: string;
}

const getColumns = (tipsWindow: Window): TableColumn[] => {
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
      },
    },
    {
      label: 'Questions',
      key: 'numQuestions',
      options: {
        customBodyRenderer: (numQuestions: number): ReactNode => (
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
      },
    },
  ];
};

const transformData = (users: UserWithIncompleteWindow[]): Row[] => {
  return users.map((user) => {
    const {
      email,
      numQuestions,
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
      hasCompletedInterview,
      coursemologyProfile,
    };
  });
};

export const IncompleteTable = ({
  users,
  window,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(window), [window]);
  const rows = useMemo(() => transformData(users), [users]);

  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{
          title: 'Incomplete',
          downloadFileName: `Incomplete for ${formatDate(
            window.startAt,
          )} - ${formatDate(window.endAt)}`,
        }}
        rows={rows}
      />
    </Card>
  );
};
