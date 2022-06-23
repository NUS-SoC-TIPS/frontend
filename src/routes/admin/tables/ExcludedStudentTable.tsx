import { ReactElement } from 'react';

import { Card } from 'components/card';
import { UserWithWindowData } from 'types/api/admin';
import { RecordWithPartner } from 'types/models/record';
import { SubmissionWithQuestion } from 'types/models/submission';
import { Window } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: UserWithWindowData[];
  window: Window;
  onInclude: (id: string) => void;
  onViewSubmissions: (submissions: SubmissionWithQuestion[]) => void;
  onViewRecords: (records: RecordWithPartner[]) => void;
}

export const ExcludedStudentTable = ({
  users,
  window,
  onInclude,
  onViewSubmissions,
  onViewRecords,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      isInclude={true}
      onIncludeOrExclude={onInclude}
      onViewRecords={onViewRecords}
      onViewSubmissions={onViewSubmissions}
      options={{
        title: 'Excluded',
        downloadFileName: `Excluded Students (${formatDate(
          window.startAt,
        )} - ${formatDate(window.endAt)})`,
      }}
      users={users}
    />
  );
};
