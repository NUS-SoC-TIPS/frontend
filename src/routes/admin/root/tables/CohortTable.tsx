import { ReactElement, ReactNode, useMemo } from 'react';
import { Button } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { TableColumn } from 'types/table';
import { formatDateWithYear } from 'utils/dateUtils';
import { compareDatesAscending } from 'utils/sortUtils';

interface Props {
  cohorts: {
    id: number;
    name: string;
    numStudents: number;
    startAt: Date | null;
    endAt: Date | null;
  }[];
  onView: (id: number) => void;
}

const getColumns = (onView: (id: number) => void): TableColumn[] => {
  return [
    {
      label: 'Name',
      key: 'name',
      options: {
        isSortable: true,
      },
    },
    {
      label: 'Number of Students',
      key: 'numStudents',
      options: {
        isSortable: true,
      },
    },
    {
      label: 'Start At',
      key: 'startAt',
      options: {
        customBodyRenderer: formatDateWithYear,
        customSearchValueRenderer: formatDateWithYear,
        customCsvBodyRenderer: formatDateWithYear,
        customSortComparator: compareDatesAscending,
        isSortable: true,
      },
    },
    {
      label: 'End At',
      key: 'endAt',
      options: {
        customBodyRenderer: formatDateWithYear,
        customSearchValueRenderer: formatDateWithYear,
        customCsvBodyRenderer: formatDateWithYear,
        customSortComparator: compareDatesAscending,
        isSortable: true,
      },
    },
    {
      label: 'Actions',
      key: 'id',
      options: {
        customBodyRenderer: (id: number): ReactNode => (
          <Button
            onClick={(): void => {
              onView(id);
            }}
            variant="secondary"
          >
            View
          </Button>
        ),
        isDownloadable: false,
        isSearchable: false,
        isVisible: true,
      },
    },
  ];
};

export const CohortTable = ({
  cohorts,
  onView,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(onView), [onView]);
  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{ isDownloadable: false, title: 'Cohorts' }}
        rows={cohorts}
      />
    </Card>
  );
};
