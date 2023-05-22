import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { SimpleGrid } from '@chakra-ui/react';

import { Banner } from 'components/banner';
import { Card, StatCardSkeleton } from 'components/card';
import { ErrorBanner } from 'components/errorBanner';
import { ADD_QUESTION } from 'constants/routes';
import { getQuestionStats, getSubmissions } from 'lib/questions';
import { QuestionStats, SubmissionListItem } from 'types/api/questions';

import { QuestionsPage } from './QuestionsPage';
import { NumCompletedCard } from './stats';
import { PastSubmissionsTable } from './tables';

interface State {
  isError: boolean;
  stats: QuestionStats | null;
  submissions: SubmissionListItem[] | null;
}

export const Questions = (): ReactElement<typeof QuestionsPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    {
      isError: false,
      stats: null,
      submissions: null,
    } as State,
  );
  const navigate = useNavigate();

  useEffect(() => {
    let didCancel = false;
    const fetchStats = (): Promise<void> => {
      return getQuestionStats()
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
    const fetchSubmissions = (): Promise<void> => {
      return getSubmissions()
        .then((submissions) => {
          if (!didCancel) {
            setState({ submissions });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({ isError: true });
          }
        });
    };

    fetchStats();
    fetchSubmissions();

    return (): void => {
      didCancel = true;
    };
  }, []);

  const { stats, isError, submissions } = state;

  if (isError) {
    return (
      <QuestionsPage>
        <ErrorBanner maxW="100%" px={0} />
      </QuestionsPage>
    );
  }

  return (
    <QuestionsPage onAdd={(): void => navigate(ADD_QUESTION)}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        {stats != null ? (
          <NumCompletedCard
            endAt={stats.progress.endOfWindowOrWeek}
            numCompleted={stats.progress.numSubmissionsThisWindowOrWeek}
            numTarget={stats.progress.numSubmissionsRequired}
            startAt={stats.progress.startOfWindowOrWeek}
          />
        ) : (
          <StatCardSkeleton />
        )}
      </SimpleGrid>
      {submissions != null ? (
        <PastSubmissionsTable submissions={submissions} />
      ) : (
        <StatCardSkeleton />
      )}
      <Card>
        <Banner
          message="Keep an eye on this section for an exciting upcoming feature!"
          title="Coming soon."
        />
      </Card>
    </QuestionsPage>
  );
};
