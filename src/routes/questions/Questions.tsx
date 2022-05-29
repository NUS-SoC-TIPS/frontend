import { ReactElement, useEffect, useReducer } from 'react';
import { SimpleGrid } from '@chakra-ui/react';

import { Banner } from 'components/banner';
import { ErrorBanner } from 'components/errorBanner';
import { getQuestionStats } from 'lib/stats';
import { QuestionStats } from 'types/api/stats/question';
import { computeWindowData } from 'utils/windowUtils';

import { Card } from '../../components/card';

import { QuestionsPage } from './QuestionsPage';
import { QuestionsSkeleton } from './QuestionsSkeleton';
import {
  LatestSubmissionCard,
  NumCompletedCard,
  WindowPeriodCard,
} from './stats';

interface State {
  isLoading: boolean;
  isError: boolean;
  stats: QuestionStats | null;
}

export const Questions = (): ReactElement<typeof QuestionsPage> => {
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
      return getQuestionStats()
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
    return <QuestionsSkeleton />;
  }

  if (isError || stats == null) {
    return (
      <QuestionsPage>
        <ErrorBanner maxW="100%" px={0} />
      </QuestionsPage>
    );
  }

  const { status, startAt, endAt } = computeWindowData(stats.closestWindow);

  return (
    <QuestionsPage>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
        <NumCompletedCard
          numCompleted={stats?.numCompletedThisWindow ?? 0}
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
      <Card>
        <Banner
          message="Keep an eye on this section for an exciting upcoming feature!"
          title="Coming soon."
        />
      </Card>
    </QuestionsPage>
  );
};
