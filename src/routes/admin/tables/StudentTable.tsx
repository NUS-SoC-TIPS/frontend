import { ReactElement } from 'react';

import { Card } from 'components/card';
import { UserWithWindowData } from 'types/api/admin';
import { Window } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: UserWithWindowData[];
  window: Window;
  onExclude: (id: string) => void;
}

export const StudentTable = ({
  users,
  window,
  onExclude,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      isInclude={false}
      onIncludeOrExclude={onExclude}
      options={{
        title: 'Students',
        downloadFileName: `Students (${formatDate(
          window.startAt,
        )} - ${formatDate(window.endAt)})`,
      }}
      users={users}
    />
  );
};
