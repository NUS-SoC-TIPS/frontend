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
      label: 'Coursemology Name',
      key: 'coursemologyName',
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
      },
    },
    {
      label: 'GitHub Username',
      key: 'githubUsername',
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
        isSearchable: false,
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
