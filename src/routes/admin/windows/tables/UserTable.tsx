import { ReactElement, ReactNode, useMemo } from 'react';
import { Box, Button, Link } from '@chakra-ui/react';

import { Card } from 'components/card';
import { Table } from 'components/table';
import { UserProfile } from 'components/userProfile';
import { WindowItem } from 'types/api/admin';
import { InterviewBase } from 'types/api/interviews';
import { SubmissionBase } from 'types/api/questions';
import { UserBase } from 'types/api/users';
import { TableColumn, TableOptions } from 'types/table';
import { emptyFunction } from 'utils/functionUtils';
import {
  compareBooleansTrueFirst,
  compareNamesAscending,
} from 'utils/sortUtils';
import { booleanRenderer, exclusionRenderer } from 'utils/tableUtils';

interface Props {
  users: WindowItem['students'];
  options?: TableOptions;
  isInclude?: boolean;
  onIncludeOrExclude?: (id: number) => void;
  onAutoExclude?: () => void;
  onViewSubmissions: (submissions: SubmissionBase[]) => void;
  onViewInterviews: (interviews: InterviewBase[]) => void;
}

interface Row {
  studentId: number;
  user: UserBase;
  name: string;
  githubUsername: string;
  coursemologyProfile: {
    name: string;
    url: string;
  };
  coursemologyName: string;
  submissions: SubmissionBase[];
  interviews: InterviewBase[];
  hasCompletedWindow: boolean;
  coursemologyProfileUrl: string;
  exclusion: { id: number; reason: string } | null;
}

const getColumns = (
  isInclude: boolean,
  onIncludeOrExclude: (id: number) => void,
  onViewSubmissions: (submissions: SubmissionBase[]) => void,
  onViewInterviews: (interviews: InterviewBase[]) => void,
): TableColumn[] => {
  return [
    {
      label: 'User',
      key: 'user',
      options: {
        customBodyRenderer: (user: UserBase): ReactNode => (
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
          url: string;
        }): ReactNode => (
          <Box>
            <Link
              color="emphasized"
              fontSize="sm"
              fontWeight="medium"
              href={profile.url}
              isExternal={true}
              noOfLines={1}
              textAlign="left"
            >
              {profile.name}
            </Link>
          </Box>
        ),
        isVisible: true,
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
        isSearchable: true,
        isDownloadable: true,
      },
    },
    {
      label: 'Coursemology Profile URL',
      key: 'coursemologyProfileUrl',
      options: {
        isVisible: false,
        isSearchable: false,
        isDownloadable: true,
      },
    },
    {
      label: 'Number of Questions',
      key: 'submissions',
      options: {
        customBodyRenderer: (submissions: SubmissionBase[]) =>
          submissions.length === 0 ? (
            0
          ) : (
            <Link onClick={(): void => onViewSubmissions(submissions)}>
              {submissions.length}
            </Link>
          ),
        customSearchValueRenderer: (submissions: SubmissionBase[]) =>
          `${submissions.length}`,
        customCsvBodyRenderer: (submissions: SubmissionBase[]) =>
          `${submissions.length}`,
        customSortComparator: (a: SubmissionBase[], b: SubmissionBase[]) =>
          a.length - b.length,
        isSortable: true,
      },
    },
    {
      label: 'Number of Interviews',
      key: 'interviews',
      options: {
        customBodyRenderer: (interviews: InterviewBase[]) =>
          interviews.length === 0 ? (
            0
          ) : (
            <Link onClick={(): void => onViewInterviews(interviews)}>
              {interviews.length}
            </Link>
          ),
        customSearchValueRenderer: (interviews: InterviewBase[]) =>
          `${interviews.length}`,
        customCsvBodyRenderer: (interviews: InterviewBase[]) =>
          `${interviews.length}`,
        customSortComparator: (a: InterviewBase[], b: InterviewBase[]) =>
          a.length - b.length,
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
          a: { reason: string } | undefined,
          b: { reason: string } | undefined,
        ) => exclusionRenderer(a).localeCompare(exclusionRenderer(b)),
        isSortable: true,
      },
    },
    {
      label: 'Actions',
      key: 'studentId',
      options: {
        customBodyRenderer: (id: number): ReactNode => (
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
        isVisible: true,
      },
    },
  ];
};

const transformData = (users: WindowItem['students']): Row[] => {
  return users.map((user) => {
    const {
      name,
      studentId,
      githubUsername,
      profileUrl,
      photoUrl,
      interviews,
      submissions,
      hasCompletedWindow,
      coursemologyName,
      coursemologyProfileUrl,
      exclusion,
    } = user;

    return {
      studentId,
      user: {
        name,
        githubUsername,
        profileUrl,
        photoUrl,
      },
      name,
      githubUsername,
      coursemologyProfile: {
        name: coursemologyName,
        url: coursemologyProfileUrl,
      },
      coursemologyName,
      interviews,
      submissions,
      hasCompletedWindow,
      coursemologyProfileUrl,
      exclusion,
    };
  });
};

export const UserTable = ({
  users,
  isInclude = false,
  options = {},
  onViewSubmissions,
  onViewInterviews,
  onIncludeOrExclude = emptyFunction,
  onAutoExclude,
}: Props): ReactElement<Props, typeof Card> => {
  const columns = useMemo(
    () =>
      getColumns(
        isInclude,
        onIncludeOrExclude,
        onViewSubmissions,
        onViewInterviews,
      ),
    [isInclude, onIncludeOrExclude, onViewSubmissions, onViewInterviews],
  );
  const rows = useMemo(() => transformData(users), [users]);

  return (
    <Card px={0} py={0}>
      <Table
        actionButton={
          onAutoExclude ? (
            <Button onClick={onAutoExclude} variant="primary">
              Auto Exclude
            </Button>
          ) : (
            <></>
          )
        }
        columns={columns}
        options={options}
        rows={rows}
      />
    </Card>
  );
};
