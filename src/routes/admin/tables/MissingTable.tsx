import { ReactElement, ReactNode } from 'react';
import { Button, Link, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserThatHasYetToJoin } from 'types/api/stats/admin';
import { TableColumn } from 'types/table';

interface Props {
  users: UserThatHasYetToJoin[];
}

const getColumns = (): TableColumn[] => {
  return [
    {
      label: 'Name',
      key: 'name',
    },
    {
      label: 'GitHub Username',
      key: 'githubUsername',
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

export const MissingTable = ({
  users,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = getColumns();

  return (
    <Card px={0} py={0}>
      <Table columns={columns} options={{ title: 'Missing' }} rows={users} />
    </Card>
  );
};
