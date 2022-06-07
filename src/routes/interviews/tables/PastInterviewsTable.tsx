import { ReactElement, ReactNode } from 'react';
import { Button } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { languageToString } from 'constants/enumStrings';
import { Language } from 'types/models/code';
import { RecordWithPartner } from 'types/models/record';
import { User } from 'types/models/user';
import { TableColumn } from 'types/table';
import { formatDate, formatDuration } from 'utils/dateUtils';

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
        customSearchValueRenderer: (partner: User) =>
          `${partner.name} ${partner.githubUsername}`,
        customCsvBodyRenderer: (partner: User) => partner.name,
      },
    },
    {
      label: 'Completed On',
      key: 'createdAt',
      options: {
        customBodyRenderer: (createdAt: Date): string => formatDate(createdAt),
        customSearchValueRenderer: (createdAt: Date): string =>
          formatDate(createdAt),
        customCsvBodyRenderer: (createdAt: Date) => formatDate(createdAt),
      },
    },
    {
      label: 'Duration',
      key: 'duration',
      options: {
        customBodyRenderer: (duration: number): string =>
          formatDuration(duration),
        customSearchValueRenderer: (duration: number): string =>
          formatDuration(duration),
        customCsvBodyRenderer: (duration: number): string =>
          formatDuration(duration),
      },
    },
    {
      label: 'Language',
      key: 'language',
      options: {
        customBodyRenderer: (language: Language): string =>
          languageToString[language],
        customSearchValueRenderer: (language: Language): string =>
          languageToString[language],
        customCsvBodyRenderer: (language: Language): string =>
          languageToString[language],
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
