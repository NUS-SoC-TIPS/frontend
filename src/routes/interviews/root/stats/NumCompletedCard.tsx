import { ReactElement } from 'react';

import { StatCard } from 'components/card';
import { formatDateWithYear } from 'utils/dateUtils';

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
    requireInterview != null
      ? 'Completed This Window (SGT)'
      : 'Completed This Week (SGT)';
  const interviews = numCompleted === 1 ? 'interview' : 'interviews';
  const stat = `${numCompleted}${
    requireInterview != null && requireInterview ? '/1' : ''
  } ${interviews}`;

  const subtitle = `${formatDateWithYear(startAt)} - ${formatDateWithYear(
    endAt,
  )}`;

  return <StatCard stat={stat} subtitle={subtitle} title={title} />;
};
