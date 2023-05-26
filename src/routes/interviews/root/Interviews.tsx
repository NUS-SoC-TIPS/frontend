import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { StatCardSkeleton } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { getInterviews, getInterviewStats } from 'lib/interviews';
import { InterviewListItem, InterviewStats } from 'types/api/interviews';

import { InterviewsPage } from './InterviewsPage';
import { NumCompletedCard } from './stats';
import { PastInterviewsTable } from './tables';

interface State {
  isError: boolean;
  stats: InterviewStats | null;
  interviews: InterviewListItem[] | null;
}

/**
 * This component constitutes a few stateful components, namely the
 * room button, the stats panels and the past interview records.
 */
export const Interviews = (): ReactElement<typeof InterviewsPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isError: false,
      stats: null,
      interviews: null,
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchStats = (): Promise<void> => {
      return getInterviewStats()
        .then((stats) => {
          if (!didCancel) {
            setState({ stats });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({ isError: true });
          }
        });
    };
    const fetchInterviews = (): Promise<void> => {
      return getInterviews()
        .then((interviews) => {
          if (!didCancel) {
            setState({ interviews });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({ isError: true });
          }
        });
    };

    fetchStats();
    fetchInterviews();

    return (): void => {
      didCancel = true;
    };
  }, []);

  const { stats, interviews, isError } = state;

  if (isError) {
    return (
      <InterviewsPage>
        <ErrorBanner maxW="100%" px={0} />
      </InterviewsPage>
    );
  }

  return (
    <InterviewsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {stats != null ? (
          <NumCompletedCard
            endAt={stats.progress.endOfWindowOrWeek}
            numCompleted={stats.progress.numInterviewsThisWindowOrWeek}
            requireInterview={stats.progress.isInterviewRequired}
            startAt={stats.progress.startOfWindowOrWeek}
          />
        ) : (
          <StatCardSkeleton />
        )}
      </SimpleGrid>
      {interviews != null ? (
        <PastInterviewsTable interviews={interviews} />
      ) : (
        <StatCardSkeleton />
      )}
    </InterviewsPage>
  );
};
