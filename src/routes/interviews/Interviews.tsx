import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { WindowPeriodCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { getInterviewStats } from 'lib/stats';
import { InterviewStats } from 'types/api/stats/interview';
import { computeWindowData } from 'utils/windowUtils';

import { InterviewsPage } from './InterviewsPage';
import { InterviewsSkeleton } from './InterviewsSkeleton';
import { LatestPartnerCard, NumCompletedCard } from './stats';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: InterviewStats | null;
}

/**
 * This component constitutes a few stateful components, namely the
 * room button, the stats panels and the past interview records.
 */
export const Interviews = (): ReactElement => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      stats: null,
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getInterviewStats()
        .then((stats) => {
          if (!didCancel) {
            setState({
              isLoading: false,
              stats,
            });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({
              isLoading: false,
              isError: true,
            });
          }
        });
    };

    fetchData();

    return (): void => {
      didCancel = true;
    };
  }, []);

  const { stats, isLoading, isError } = state;

  if (isLoading) {
    return <InterviewsSkeleton />;
  }

  if (isError || stats == null) {
    return (
      <InterviewsPage>
        <ErrorBanner maxW="100%" px={0} />
      </InterviewsPage>
    );
  }

  const { status, startAt, endAt } = computeWindowData(stats.closestWindow);

  return (
    <InterviewsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <NumCompletedCard
          numCompleted={stats?.numCompletedThisWindow ?? 0}
          requireInterview={stats?.closestWindow.requireInterview}
          windowStatus={status}
        />
        <WindowPeriodCard
          endAt={endAt}
          startAt={startAt}
          windowStatus={status}
        />
        <LatestPartnerCard partner={stats?.latestPartner ?? null} />
      </SimpleGrid>
    </InterviewsPage>
  );
};
