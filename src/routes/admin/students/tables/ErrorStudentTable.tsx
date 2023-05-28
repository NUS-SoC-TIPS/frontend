import { ReactElement, useMemo } from 'react';
import { Box, Link } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { TableColumn } from 'types/table';

interface Props {
  students: {
    githubUsername: string;
    coursemologyName: string;
    coursemologyProfileUrl: string;
    error: 'ALREADY ADDED' | 'NOT FOUND' | 'INVALID DATA';
  }[];
  isCreated: boolean;
}

const getColumns = (): TableColumn[] => {
  return [
    {
      label: 'GitHub Username',
      key: 'githubUsername',
      options: {
        isVisible: false,
      },
    },
    {
      label: 'Coursemology Name',
      key: 'coursemologyName',
      options: {
        isSortable: true,
      },
    },
    {
      label: 'Coursemology Profile URL',
      key: 'coursemologyProfileUrl',
      options: {
        customBodyRenderer: (url: string) => (
          <Box>
            <Link
              color="emphasized"
              fontSize="sm"
              fontWeight="medium"
              href={url}
              isExternal={true}
              noOfLines={1}
              textAlign="left"
            >
              {url}
            </Link>
          </Box>
        ),
      },
    },
    {
      label: 'Error',
      key: 'error',
      options: {
        isSortable: true,
      },
    },
  ];
};

export const ErrorStudentTable = ({
  students,
  isCreated,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);

  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{
          title: isCreated ? 'Failed to Add' : 'Cannot Add',
          downloadFileName: isCreated ? 'Failed to Add' : 'Cannot Add',
        }}
        rows={students}
      />
    </Card>
  );
};
