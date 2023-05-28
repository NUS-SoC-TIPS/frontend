import { ReactElement } from 'react';

import { StatCard } from 'components/card';
import { formatDateWithYear } from 'utils/dateUtils';

interface Props {
  numCompleted: number;
  numTarget: number | null;
  startAt: Date;
  endAt: Date;
}

export const NumCompletedCard = ({
  numCompleted,
  numTarget,
  startAt,
  endAt,
}: Props): ReactElement<Props, typeof StatCard> => {
  const title =
    numTarget != null
      ? 'Completed This Window (SGT)'
      : 'Completed This Week (SGT)';

  const questions =
    numCompleted === 1
      ? numTarget && numTarget > 1
        ? 'questions'
        : 'question'
      : 'questions';
  const stat = `${numCompleted}${
    numTarget != null ? `/${numTarget}` : ''
  } ${questions}`;

  const subtitle = `${formatDateWithYear(startAt)} - ${formatDateWithYear(
    endAt,
  )}`;

  return <StatCard stat={stat} subtitle={subtitle} title={title} />;
};
