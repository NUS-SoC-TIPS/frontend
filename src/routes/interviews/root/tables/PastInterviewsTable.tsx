import { ReactElement, ReactNode, useMemo } from 'react';
import { Button, Link } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { Table } from '@/components/table';
import { UserProfile } from '@/components/userProfile';
import { PAST_INTERVIEW } from '@/constants/routes';
import { InterviewListItem } from '@/types/api/interviews';
import { UserBase } from '@/types/api/users';
import { TableColumn } from '@/types/table';
import { formatDateWithYear, formatDuration } from '@/utils/dateUtils';
import {
  compareDatesAscending,
  compareLanguagesAscending,
  compareNamesAscending,
} from '@/utils/sortUtils';
import { languageRenderer } from '@/utils/tableUtils';

interface Props {
  interviews: InterviewListItem[];
}

const getColumns = (): TableColumn[] => {
  return [
    {
      label: 'Partner',
      key: 'partner',
      options: {
        customBodyRenderer: (partner: UserBase): ReactNode => (
          <UserProfile ps={0} user={partner} />
        ),
        customSearchValueRenderer: (partner: UserBase) => partner.name,
        customCsvBodyRenderer: (partner: UserBase) => partner.name,
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
      label: 'Completed At (SGT)',
      key: 'completedAt',
      options: {
        customBodyRenderer: formatDateWithYear,
        customSearchValueRenderer: formatDateWithYear,
        customCsvBodyRenderer: formatDateWithYear,
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
          <Link href={`${PAST_INTERVIEW}/${id}`} isExternal={true}>
            <Button variant="secondary">View</Button>
          </Link>
        ),
        isDownloadable: false,
        isSearchable: false,
      },
    },
  ];
};

export const PastInterviewsTable = ({
  interviews,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(() => getColumns(), []);
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
