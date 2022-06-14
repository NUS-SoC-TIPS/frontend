import { ReactElement } from 'react';

import { Card } from 'components/card';
import { UserWithWindowData } from 'types/api/admin';
import { Window } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: UserWithWindowData[];
  window: Window;
  onInclude: (id: string) => void;
}

export const ExcludedStudentTable = ({
  users,
  window,
  onInclude,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      isInclude={true}
      onIncludeOrExclude={onInclude}
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
