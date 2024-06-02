import { ReactElement, useMemo } from 'react';
import { Box, Link } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { TableColumn } from '@/types/table';

interface Props {
  data: {
    githubUsername: string;
    coursemologyName: string;
    coursemologyProfileUrl: string;
  }[];
}

const getColumns = (): TableColumn[] => {
  return [
    {
      label: 'GitHub Username',
      key: 'githubUsername',
      options: {
        isSortable: true,
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
              color="fg.emphasized"
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
  ];
};

export const UploadedDataTable = ({
  data,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);

  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{
          title: 'Uploaded Data',
          isDownloadable: false,
        }}
        rows={data}
      />
    </Card>
  );
};
