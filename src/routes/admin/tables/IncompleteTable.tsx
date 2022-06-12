import { ReactElement } from 'react';

import { Card } from 'components/card';
import { UserWithWindowData } from 'types/api/admin';
import { Window } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

import { UserTable } from './UserTable';

interface Props {
  users: UserWithWindowData[];
  window: Window;
}

export const IncompleteTable = ({
  users,
  window,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <UserTable
      options={{
        title: 'Incomplete',
        downloadFileName: `Incomplete for ${formatDate(
          window.startAt,
        )} - ${formatDate(window.endAt)}`,
      }}
      users={users}
    />
  );
};
