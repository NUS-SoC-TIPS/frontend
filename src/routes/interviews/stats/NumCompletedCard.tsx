import { ReactElement } from 'react';

import { StatCard } from 'components/card';
import { WindowStatus } from 'types/models/window';

interface Props {
  windowStatus: WindowStatus;
  numCompleted: number;
  requireInterview: boolean;
}

export const NumCompletedCard = ({
  windowStatus,
  requireInterview,
  numCompleted,
}: Props): ReactElement<Props, typeof StatCard> => {
  const isOngoing = windowStatus === WindowStatus.ONGOING;
  const title = isOngoing ? 'Completed This Window' : 'Completed This Week';
  const stat = `${numCompleted}${requireInterview ? '/1' : ''} interviews`;

  return <StatCard stat={stat} title={title} />;
};
