import { ReactElement } from 'react';

import { StatCard } from 'components/card';
import { formatDate } from 'utils/dateUtils';

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
    numTarget != null ? 'Completed This Window' : 'Completed This Week';

  const questions = numCompleted === 1 ? 'question' : 'questions';
  const stat = `${numCompleted}${
    numTarget != null ? `/${numTarget}` : ''
  } ${questions}`;

  const subtitle = `${formatDate(startAt)} - ${formatDate(endAt)}`;

  return <StatCard stat={stat} subtitle={subtitle} title={title} />;
};
