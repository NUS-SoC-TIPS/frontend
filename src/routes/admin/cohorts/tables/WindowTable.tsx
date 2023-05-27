import { ReactElement, ReactNode, useMemo } from 'react';
import { Button } from '@chakra-ui/react';

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
  onEdit: (id: number) => void;
  onAdd: () => void;
}

const getColumns = (onEdit: (id: number) => void): TableColumn[] => {
  return [
    {
      label: 'Start At (SGT)',
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
      label: 'End At (SGT)',
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
          <Button
            onClick={(): void => {
              onEdit(id);
            }}
            variant="secondary"
          >
            Edit
          </Button>
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
  onEdit,
  onAdd,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(onEdit), [onEdit]);

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
