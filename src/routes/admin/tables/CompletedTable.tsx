import { ReactElement } from 'react';

import { Card } from 'components/card';
import { UserWithWindowData } from 'types/api/stats/admin';
import { Window } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: UserWithWindowData[];
  window: Window;
}

export const CompletedTable = ({
  users,
  window,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      options={{
        title: 'Completed',
        downloadFileName: `Completed for ${formatDate(
          window.startAt,
        )} - ${formatDate(window.endAt)}`,
      }}
      showRawCount={true}
      users={users}
      window={window}
    />
  );
};
