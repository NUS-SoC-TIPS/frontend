import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { Banner } from 'components/banner';
import { Card, WindowPeriodCard } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { getSubmissionStats } from 'lib/submissions';
import { SubmissionStatsEntity } from 'types/api/submissions';
import { SubmissionWithQuestion } from 'types/models/submission';
import { computeWindowData } from 'utils/windowUtils';

import { PastSubmission } from './PastSubmission';
import { QuestionsPage } from './QuestionsPage';
import { QuestionsSkeleton } from './QuestionsSkeleton';
import { LatestSubmissionCard, NumCompletedCard } from './stats';
import { PastSubmissionsTable } from './tables';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: SubmissionStatsEntity | null;
  selectedSubmission: SubmissionWithQuestion | null;
}

export const Questions = (): ReactElement<typeof QuestionsPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      stats: null,
      selectedSubmission: null,
    } as State,
  );

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getSubmissionStats()
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

  const { stats, isLoading, isError, selectedSubmission } = state;

  if (isLoading) {
    return <QuestionsSkeleton />;
  }

  if (isError || stats == null) {
    return (
      <QuestionsPage>
        <ErrorBanner maxW="100%" px={0} />
      </QuestionsPage>
    );
  }

  if (selectedSubmission) {
    return <PastSubmission submission={selectedSubmission} />;
  }

  const { status, startAt, endAt } = computeWindowData(stats.closestWindow);

  const onView = (id: number): void => {
    const selectedSubmission =
      stats.allSubmissions.find((submission) => submission.id === id) ?? null;
    setState({ selectedSubmission });
  };

  return (
    <QuestionsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <NumCompletedCard
          numCompleted={stats?.numberOfSubmissionsForThisWindowOrWeek ?? 0}
          numTarget={stats?.closestWindow.numQuestions ?? 7}
          windowStatus={status}
        />
        <WindowPeriodCard
          endAt={endAt}
          startAt={startAt}
          windowStatus={status}
        />
        <LatestSubmissionCard submission={stats?.latestSubmission} />
      </SimpleGrid>
      <PastSubmissionsTable
        onView={onView}
        submissions={stats.allSubmissions}
      />
      <Card>
        <Banner
          message="Keep an eye on this section for an exciting upcoming feature!"
          title="Coming soon."
        />
      </Card>
    </QuestionsPage>
  );
};
