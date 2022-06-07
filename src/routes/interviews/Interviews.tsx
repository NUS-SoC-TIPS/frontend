import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { WindowPeriodCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { getRecordStats } from 'lib/records';
import { RecordStatsEntity } from 'types/api/records';
import { RecordWithPartner } from 'types/models/record';
import { computeWindowData } from 'utils/windowUtils';

import { InterviewsPage } from './InterviewsPage';
import { InterviewsSkeleton } from './InterviewsSkeleton';
import { PastInterview } from './PastInterview';
import { LatestPartnerCard, NumCompletedCard } from './stats';
import { PastInterviewsTable } from './tables';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: RecordStatsEntity | null;
  selectedInterview: RecordWithPartner | null;
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
      selectedInterview: null,
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getRecordStats()
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

  const { stats, isLoading, isError, selectedInterview } = state;

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

  if (selectedInterview) {
    return (
      <PastInterview
        interview={selectedInterview}
        onBack={(): void => setState({ selectedInterview: null })}
      />
    );
  }

  const { status, startAt, endAt } = computeWindowData(stats.closestWindow);

  const onView = (id: number): void => {
    const selectedInterview =
      stats.allRecords.find((interview) => interview.id === id) ?? null;
    setState({ selectedInterview });
  };

  return (
    <InterviewsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <NumCompletedCard
          numCompleted={stats.numberOfRecordsForThisWindowOrWeek}
          requireInterview={stats.closestWindow.requireInterview}
          windowStatus={status}
        />
        <WindowPeriodCard
          endAt={endAt}
          startAt={startAt}
          windowStatus={status}
        />
        <LatestPartnerCard partner={stats.latestRecord?.partner ?? null} />
      </SimpleGrid>
      <PastInterviewsTable interviews={stats.allRecords} onView={onView} />
    </InterviewsPage>
  );
};
