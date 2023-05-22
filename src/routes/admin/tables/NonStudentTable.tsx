import { ReactElement } from 'react';

import { Card } from 'components/card';
import { UserWithWindowData } from 'types/api/admin';
import { RecordWithPartner } from 'types/models/record';
import { SubmissionWithQuestion } from 'types/models/submission';
import { Window } from 'types/models/window';
import { formatDateWithYear } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: UserWithWindowData[];
  window: Window;
  onViewSubmissions: (submissions: SubmissionWithQuestion[]) => void;
  onViewRecords: (records: RecordWithPartner[]) => void;
}

export const NonStudentTable = ({
  users,
  window,
  onViewSubmissions,
  onViewRecords,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      onViewRecords={onViewRecords}
      onViewSubmissions={onViewSubmissions}
      options={{
        title: 'Non-Students',
        downloadFileName: `Non-Students (${formatDateWithYear(
          window.startAt,
        )} - ${formatDateWithYear(window.endAt)})`,
      }}
      users={users}
      usersAreStudents={false}
    />
  );
};
