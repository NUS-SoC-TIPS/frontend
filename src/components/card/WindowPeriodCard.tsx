import { ReactElement } from 'react';

import { WindowStatus } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

import { StatCard } from './StatCard';

interface Props {
  windowStatus: WindowStatus;
  startAt: Date;
  endAt: Date;
}

export const WindowPeriodCard = ({
  windowStatus,
  startAt,
  endAt,
}: Props): ReactElement<typeof StatCard> => {
  const getTitle = (): string => {
    switch (windowStatus) {
      case WindowStatus.ONGOING:
        return 'Current Window';
      case WindowStatus.UPCOMING:
        return 'Upcoming Window';
      case WindowStatus.OVER:
        return 'Last Window';
    }
  };

  return (
    <StatCard
      stat={`${formatDate(startAt)} - ${formatDate(endAt)}`}
      title={getTitle()}
    />
  );
};
