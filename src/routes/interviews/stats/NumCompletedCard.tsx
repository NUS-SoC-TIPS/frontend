import { ReactElement } from 'react';

import { StatCard } from 'components/card';
import { formatDate } from 'utils/dateUtils';

interface Props {
  numCompleted: number;
  requireInterview: boolean | null;
  startAt: Date;
  endAt: Date;
}

export const NumCompletedCard = ({
  requireInterview,
  numCompleted,
  startAt,
  endAt,
}: Props): ReactElement<Props, typeof StatCard> => {
  const title =
    requireInterview != null ? 'Completed This Window' : 'Completed This Week';
  const interviews = numCompleted === 1 ? 'interview' : 'interviews';
  const stat = `${numCompleted}${
    requireInterview != null ? '/1' : ''
  } ${interviews}`;

  const subtitle = `${formatDate(startAt)} - ${formatDate(endAt)}`;

  return <StatCard stat={stat} subtitle={subtitle} title={title} />;
};
