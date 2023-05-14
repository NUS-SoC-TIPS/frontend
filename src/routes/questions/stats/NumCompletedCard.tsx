import { ReactElement } from 'react';

import { StatCard } from 'components/card';

interface Props {
  numCompleted: number;
  numTarget: number | null;
}

export const NumCompletedCard = ({
  numCompleted,
  numTarget,
}: Props): ReactElement<Props, typeof StatCard> => {
  const title =
    numTarget != null ? 'Completed This Window' : 'Completed This Week';
  const stat = `${numCompleted}${
    numTarget != null ? `/${numTarget}` : ''
  } questions`;

  return <StatCard stat={stat} title={title} />;
};
