import { ReactElement } from 'react';

import { StatCard } from 'components/card';
import { WindowStatus } from 'types/models/window';

interface Props {
  windowStatus: WindowStatus;
  numCompleted: number;
  numTarget: number;
}

export const NumCompletedCard = ({
  windowStatus,
  numCompleted,
  numTarget,
}: Props): ReactElement<Props, typeof StatCard> => {
  const isOngoing = windowStatus === WindowStatus.ONGOING;
  const title = isOngoing ? 'Completed This Window' : 'Completed This Week';
  const stat = `${numCompleted}${isOngoing ? `/${numTarget}` : ''} questions`;

  return <StatCard stat={stat} title={title} />;
};
