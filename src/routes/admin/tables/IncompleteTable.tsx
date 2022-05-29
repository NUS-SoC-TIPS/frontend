import { ReactElement, ReactNode } from 'react';
import { Button, Link, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { UserWithIncompleteWindow } from 'types/api/stats/admin';
import { User } from 'types/models/user';
import { Window } from 'types/models/window';
import { TableColumn } from 'types/table';

import { Completion } from './Completion';

interface Props {
  users: UserWithIncompleteWindow[];
  window: Window;
}

interface Row {
  user: User;
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
            variant="primary"
          >
            View Profile
          </Button>
        ),
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
  const columns = getColumns(window);
  const rows = transformData(users);

  return (
    <Card px={0} py={0}>
      <Table columns={columns} options={{ title: 'Incomplete' }} rows={rows} />
    </Card>
  );
};
