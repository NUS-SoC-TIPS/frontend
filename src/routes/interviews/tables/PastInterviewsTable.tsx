import { ReactElement, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { RecordWithPartner } from 'types/models/record';
import { User } from 'types/models/user';
import { TableColumn } from 'types/table';
import { formatDate, formatDuration } from 'utils/dateUtils';
import {
  compareDatesAscending,
  compareLanguagesAscending,
  compareNamesAscending,
} from 'utils/sortUtils';
import { languageRenderer } from 'utils/tableUtils';

interface Props {
  interviews: RecordWithPartner[];
  onView: (id: number) => void;
}

const getColumns = (onView: (id: number) => void): TableColumn[] => {
  return [
    {
      label: 'Partner',
      key: 'partner',
      options: {
        customBodyRenderer: (partner: User): ReactNode => (
          <UserProfile ps={0} user={partner} />
        ),
        customSearchValueRenderer: (partner: User) => partner.name,
        customCsvBodyRenderer: (partner: User) => partner.name,
        customSortComparator: compareNamesAscending,
        isSortable: true,
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
      label: 'Completed On',
      key: 'createdAt',
      options: {
        customBodyRenderer: formatDate,
        customSearchValueRenderer: formatDate,
        customCsvBodyRenderer: formatDate,
        customSortComparator: compareDatesAscending,
        isSortable: true,
      },
    },
    {
      label: 'Duration',
      key: 'duration',
      options: {
        customBodyRenderer: formatDuration,
        customSearchValueRenderer: formatDuration,
        customCsvBodyRenderer: formatDuration,
        isSortable: true,
      },
    },
    {
      label: 'Language',
      key: 'language',
      options: {
        customBodyRenderer: languageRenderer,
        customSearchValueRenderer: languageRenderer,
        customCsvBodyRenderer: languageRenderer,
        customSortComparator: compareLanguagesAscending,
        isSortable: true,
      },
    },
    {
      label: 'Action',
      key: 'id',
      options: {
        customBodyRenderer: (id: number): ReactNode => (
          <Button onClick={(): void => onView(id)} variant="secondary">
            View
          </Button>
        ),
        isDownloadable: false,
        isSearchable: false,
      },
    },
  ];
};

export const PastInterviewsTable = ({
  interviews,
  onView,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = getColumns(onView);
  return (
    <Card px={0} py={0}>
      <Table
        columns={columns}
        options={{ isDownloadable: false, title: 'Past Interviews' }}
        rows={interviews}
      />
    </Card>
  );
};
