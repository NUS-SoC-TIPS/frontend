import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, SimpleGrid } from '@chakra-ui/react';

import { Banner } from 'components/banner';
import { Dashboard, Page } from 'components/page';
import { ADD_QUESTION } from 'constants/routes';
import { getQuestionStats } from 'lib/stats';
import { QuestionStats } from 'types/api/stats';
import { computeWindowData } from 'utils/windowUtils';

import { Card } from '../../components/card';

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

export const Questions = (): ReactElement<typeof Page> => {
  const navigate = useNavigate();
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
    const fetchData = async (): Promise<void> => {
      try {
        const stats = await getQuestionStats();
        if (!didCancel) {
          setState({
            isLoading: false,
            stats,
          });
        }
      } catch {
        if (!didCancel) {
          setState({
            isLoading: false,
            isError: true,
          });
        }
      }
    };

    fetchData();

    return (): void => {
      didCancel = true;
    };
  }, []);

  const { stats } = state;
  const isLoaded = !state.isLoading && stats != null;
  const { status, startAt, endAt } = computeWindowData(stats?.closestWindow);

  return (
    <Page>
      <Dashboard
        actions={
          <Button
            onClick={(): void => navigate(ADD_QUESTION)}
            variant="primary"
          >
            Add Question
          </Button>
        }
        heading="Questions"
        subheading="Add your questions here once you have completed them!"
      >
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
          <NumCompletedCard
            isLoaded={isLoaded}
            numCompleted={stats?.numCompletedThisWindow ?? 0}
            numTarget={stats?.closestWindow.numQuestions ?? 7}
            windowStatus={status}
          />
          <WindowPeriodCard
            endAt={endAt}
            isLoaded={isLoaded}
            startAt={startAt}
            windowStatus={status}
          />
          <LatestSubmissionCard
            isLoaded={isLoaded}
            submission={stats?.latestSubmission}
          />
        </SimpleGrid>
        <Card>
          <Banner
            message="Keep an eye on this section for an exciting upcoming feature!"
            title="Coming soon."
          />
        </Card>
      </Dashboard>
    </Page>
  );
};
