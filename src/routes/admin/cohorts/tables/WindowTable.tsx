import { ReactElement, ReactNode, useMemo } from 'react';
import { Button, HStack } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { WindowBase } from 'types/api/windows';
import { TableColumn } from 'types/table';
import { formatDateWithYear } from 'utils/dateUtils';
import {
  compareBooleansTrueFirst,
  compareDatesAscending,
} from 'utils/sortUtils';
import { booleanRenderer } from 'utils/tableUtils';

interface Props {
  windows: WindowBase[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onAdd: () => void;
}

const getColumns = (
  onView: (id: number) => void,
  onEdit: (id: number) => void,
): TableColumn[] => {
  return [
    {
      label: 'Start At (00:00 SGT)',
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
      label: 'End At (23:59 SGT)',
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
      label: 'Number of Questions',
      key: 'numQuestions',
      options: {
        isSortable: true,
      },
    },
    {
      label: 'Require Interview',
      key: 'requireInterview',
      options: {
        customBodyRenderer: booleanRenderer,
        customSearchValueRenderer: booleanRenderer,
        customCsvBodyRenderer: booleanRenderer,
        customSortComparator: compareBooleansTrueFirst,
        isSortable: true,
      },
    },
    {
      label: 'Actions',
      key: 'id',
      options: {
        customBodyRenderer: (id: number): ReactNode => (
          <HStack spacing={2}>
            <Button onClick={(): void => onView(id)} variant="secondary">
              View
            </Button>
            <Button onClick={(): void => onEdit(id)} variant="secondary">
              Edit
            </Button>
          </HStack>
        ),
        isDownloadable: false,
        isSearchable: false,
        isVisible: true,
      },
    },
  ];
};

export const WindowTable = ({
  windows,
  onView,
  onEdit,
  onAdd,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(onView, onEdit), [onView, onEdit]);

  return (
    <Card px={0} py={0}>
      <Table
        actionButton={
          <Button onClick={onAdd} variant="primary">
            Add Window
          </Button>
        }
        columns={columns}
        options={{
          title: 'Windows',
          isDownloadable: false,
          numRowsPerPage: windows.length,
        }}
        rows={windows}
      />
    </Card>
  );
};
