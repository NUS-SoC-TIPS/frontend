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
  onExclude: (id: string) => void;
  onViewSubmissions: (submissions: SubmissionWithQuestion[]) => void;
  onViewRecords: (records: RecordWithPartner[]) => void;
}

export const StudentTable = ({
  users,
  window,
  onExclude,
  onViewSubmissions,
  onViewRecords,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      isInclude={false}
      onIncludeOrExclude={onExclude}
      onViewRecords={onViewRecords}
      onViewSubmissions={onViewSubmissions}
      options={{
        title: 'Students',
        downloadFileName: `Students (${formatDateWithYear(
          window.startAt,
        )} - ${formatDateWithYear(window.endAt)})`,
      }}
      users={users}
    />
  );
};
