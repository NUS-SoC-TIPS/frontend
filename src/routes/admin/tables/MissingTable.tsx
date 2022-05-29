import { ReactElement, ReactNode, useMemo } from 'react';
import { Button, Link, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserThatHasYetToJoin } from 'types/api/stats/admin';
import { Window } from 'types/models/window';
import { TableColumn } from 'types/table';
import { formatDate } from 'utils/dateUtils';

interface Props {
  users: UserThatHasYetToJoin[];
  window: Window;
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

export const MissingTable = ({
  users,
  window,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);

  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{
          title: 'Missing',
          downloadFileName: `Missing for ${formatDate(
            window.startAt,
          )} - ${formatDate(window.endAt)}`,
        }}
        rows={users}
      />
    </Card>
  );
};
