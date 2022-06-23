import { ReactElement, ReactNode, useMemo } from 'react';
import { Box, Button, Link } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { UserWithWindowData } from 'types/api/admin';
import { Exclusion } from 'types/models/exclusion';
import { RecordWithPartner } from 'types/models/record';
import { SubmissionWithQuestion } from 'types/models/submission';
import { User } from 'types/models/user';
import { TableColumn, TableOptions } from 'types/table';
import { emptyFunction } from 'utils/functionUtils';
import {
  compareBooleansTrueFirst,
  compareNamesAscending,
} from 'utils/sortUtils';
import { booleanRenderer, exclusionRenderer } from 'utils/tableUtils';

interface Props {
  users: UserWithWindowData[];
  usersAreStudents?: boolean;
  options?: TableOptions;
  isInclude?: boolean;
  onIncludeOrExclude?: (id: string) => void;
  onViewSubmissions: (submissions: SubmissionWithQuestion[]) => void;
  onViewRecords: (records: RecordWithPartner[]) => void;
}

interface Row {
  id: string;
  user: User;
  name: string;
  githubUsername: string;
  coursemologyProfile: {
    name: string;
    link: string;
    email: string;
  };
  coursemologyName: string;
  coursemologyEmail: string;
  submissions: SubmissionWithQuestion[];
  records: RecordWithPartner[];
  hasCompletedWindow: boolean;
  coursemologyProfileLink: string;
  exclusion?: Exclusion;
}

const getColumns = (
  usersAreStudents: boolean,
  isInclude: boolean,
  onIncludeOrExclude: (id: string) => void,
  onViewSubmissions: (submissions: SubmissionWithQuestion[]) => void,
  onViewRecords: (records: RecordWithPartner[]) => void,
): TableColumn[] => {
  return [
    {
      label: 'User',
      key: 'user',
      options: {
        customBodyRenderer: (user: User): ReactNode => (
          <UserProfile ps={0} user={user} />
        ),
        isSearchable: false,
        isDownloadable: false,
        isSortable: true,
        customSortComparator: compareNamesAscending,
      },
    },
    {
      label: 'Name',
      key: 'name',
      options: {
        isVisible: false,
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
      label: 'Coursemology Profile',
      key: 'coursemologyProfile',
      options: {
        customBodyRenderer: (profile: {
          name: string;
          link: string;
          email: string;
        }): ReactNode => (
          <Box>
            <Link
              color="emphasized"
              fontSize="sm"
              fontWeight="medium"
              href={profile.link}
              isExternal={true}
              noOfLines={1}
              textAlign="left"
            >
              {profile.name}
            </Link>
            <Link
              color="muted"
              fontSize="sm"
              href={`mailto:${profile.email}`}
              isExternal={true}
              noOfLines={1}
              textAlign="left"
            >
              {profile.email}
            </Link>
          </Box>
        ),
        isVisible: usersAreStudents,
        isSearchable: false,
        isDownloadable: false,
        isSortable: true,
        customSortComparator: compareNamesAscending,
      },
    },
    {
      label: 'Coursemology Name',
      key: 'coursemologyName',
      options: {
        isVisible: false,
        isSearchable: usersAreStudents,
        isDownloadable: usersAreStudents,
      },
    },
    {
      label: 'Coursemology Email',
      key: 'coursemologyEmail',
      options: {
        isVisible: false,
        isSearchable: usersAreStudents,
        isDownloadable: usersAreStudents,
      },
    },
    {
      label: 'Coursemology Profile Link',
      key: 'coursemologyProfileLink',
      options: {
        isVisible: false,
        isSearchable: false,
        isDownloadable: usersAreStudents,
      },
    },
    {
      label: 'Number of Questions',
      key: 'submissions',
      options: {
        customBodyRenderer: (submissions: SubmissionWithQuestion[]) =>
          submissions.length === 0 ? (
            0
          ) : (
            <Link onClick={(): void => onViewSubmissions(submissions)}>
              {submissions.length}
            </Link>
          ),
        customSearchValueRenderer: (submissions: SubmissionWithQuestion[]) =>
          `${submissions.length}`,
        customCsvBodyRenderer: (submissions: SubmissionWithQuestion[]) =>
          `${submissions.length}`,
        customSortComparator: (
          a: SubmissionWithQuestion[],
          b: SubmissionWithQuestion[],
        ) => a.length - b.length,
        isSortable: true,
      },
    },
    {
      label: 'Number of Interviews',
      key: 'records',
      options: {
        customBodyRenderer: (records: RecordWithPartner[]) =>
          records.length === 0 ? (
            0
          ) : (
            <Link onClick={(): void => onViewRecords(records)}>
              {records.length}
            </Link>
          ),
        customSearchValueRenderer: (records: RecordWithPartner[]) =>
          `${records.length}`,
        customCsvBodyRenderer: (records: RecordWithPartner[]) =>
          `${records.length}`,
        customSortComparator: (
          a: RecordWithPartner[],
          b: RecordWithPartner[],
        ) => a.length - b.length,
        isSortable: true,
      },
    },
    {
      label: 'Completed Window',
      key: 'hasCompletedWindow',
      options: {
        customBodyRenderer: booleanRenderer,
        customSearchValueRenderer: booleanRenderer,
        customCsvBodyRenderer: booleanRenderer,
        customSortComparator: compareBooleansTrueFirst,
        isSortable: true,
      },
    },
    {
      label: 'Reason for Exclusion',
      key: 'exclusion',
      options: {
        customBodyRenderer: exclusionRenderer,
        customSearchValueRenderer: exclusionRenderer,
        customCsvBodyRenderer: exclusionRenderer,
        isVisible: isInclude,
        isDownloadable: isInclude,
        isSearchable: isInclude,
        customSortComparator: (
          a: Exclusion | undefined,
          b: Exclusion | undefined,
        ) => exclusionRenderer(a).localeCompare(exclusionRenderer(b)),
        isSortable: true,
      },
    },
    {
      label: 'Actions',
      key: 'id',
      options: {
        customBodyRenderer: (id: string): ReactNode => (
          <Button
            onClick={(): void => {
              onIncludeOrExclude(id);
            }}
            variant="secondary"
          >
            {isInclude ? 'Include' : 'Exclude'}
          </Button>
        ),
        isDownloadable: false,
        isSearchable: false,
        isVisible: usersAreStudents,
      },
    },
  ];
};

const transformData = (
  users: (UserWithWindowData & { exclusion?: Exclusion })[],
): Row[] => {
  return users.map((user) => {
    const {
      records,
      submissions,
      hasCompletedWindow,
      coursemologyName,
      coursemologyEmail,
      coursemologyProfileLink,
      exclusion,
      ...userData
    } = user;

    return {
      id: user.id,
      user: userData,
      name: user.name,
      githubUsername: user.githubUsername,
      coursemologyProfile: {
        name: coursemologyName,
        link: coursemologyProfileLink,
        email: coursemologyEmail,
      },
      coursemologyName,
      coursemologyEmail,
      records,
      submissions,
      hasCompletedWindow,
      coursemologyProfileLink,
      exclusion,
    };
  });
};

export const UserTable = ({
  users,
  usersAreStudents = true,
  isInclude = false,
  options = {},
  onViewSubmissions,
  onViewRecords,
  onIncludeOrExclude = emptyFunction,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(
    () =>
      getColumns(
        usersAreStudents,
        isInclude,
        onIncludeOrExclude,
        onViewSubmissions,
        onViewRecords,
      ),
    [
      usersAreStudents,
      isInclude,
      onIncludeOrExclude,
      onViewSubmissions,
      onViewRecords,
    ],
  );
  const rows = useMemo(() => transformData(users), [users]);

  return (
    <Card px={0} py={0}>
      <Table columns={columns} options={options} rows={rows} />
    </Card>
  );
};
