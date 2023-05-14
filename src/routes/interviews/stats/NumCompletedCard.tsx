import { ReactElement } from 'react';

import { StatCard } from 'components/card';

interface Props {
  numCompleted: number;
  requireInterview: boolean | null;
}

export const NumCompletedCard = ({
  requireInterview,
  numCompleted,
}: Props): ReactElement<Props, typeof StatCard> => {
  const title =
    requireInterview != null ? 'Completed This Window' : 'Completed This Week';
  const stat = `${numCompleted}${
    requireInterview != null ? '/1' : ''
  } interviews`;

  return <StatCard stat={stat} title={title} />;
};
