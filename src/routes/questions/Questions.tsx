import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import { Banner } from 'components/banner';
import { Page } from 'components/page';
import { SubmissionBox } from 'components/submission';
import { ADD_QUESTION } from 'constants/routes';
import { getQuestionStats } from 'lib/stats';
import { QuestionStats } from 'types/api/stats';
import { formatDate } from 'utils/dateUtils';

import { Card } from '../../components/card';

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

  const currentTime = new Date();
  const isFetchingData = state.isLoading || state.stats == null;
  const isOngoingWindow = state.stats
    ? state.stats.closestWindow.startAt <= currentTime &&
      state.stats.closestWindow.endAt >= currentTime
    : true;

  return (
    <Page>
      <Stack spacing={{ base: '8', lg: '6' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          justify="space-between"
          spacing="4"
        >
          <Stack spacing="1">
            <Heading
              fontWeight="medium"
              size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
            >
              Questions
            </Heading>
            <Text color="muted">
              Add your questions here once you have completed them!
            </Text>
          </Stack>
          <Stack direction="row" spacing="3">
            <Button
              onClick={(): void => navigate(ADD_QUESTION)}
              variant="primary"
            >
              Add Question
            </Button>
          </Stack>
        </Stack>
        <Stack spacing={{ base: '5', lg: '6' }}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="6">
            <Card>
              <Stack>
                <Skeleton isLoaded={!isFetchingData}>
                  <Text color="muted" fontSize="sm">
                    {isOngoingWindow
                      ? 'Completed This Window'
                      : 'Completed This Week'}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isFetchingData}>
                  <Heading size="sm">
                    {state.stats?.numCompletedThisWindow ?? 0}
                    {isOngoingWindow
                      ? `/${state.stats?.closestWindow.numQuestions ?? 7}`
                      : ''}{' '}
                    questions
                  </Heading>
                </Skeleton>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <Skeleton isLoaded={!isFetchingData}>
                  <Text color="muted" fontSize="sm">
                    {isOngoingWindow
                      ? 'Current Window'
                      : (state.stats?.closestWindow.startAt ?? currentTime) >=
                        currentTime
                      ? 'Upcoming Window'
                      : 'Last Window'}
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isFetchingData}>
                  <Heading size="sm">
                    {formatDate(
                      state.stats?.closestWindow.startAt ?? currentTime,
                    )}{' '}
                    -{' '}
                    {formatDate(
                      state.stats?.closestWindow.endAt ?? currentTime,
                    )}
                  </Heading>
                </Skeleton>
              </Stack>
            </Card>
            <Card>
              <Stack>
                <Skeleton isLoaded={!isFetchingData}>
                  <Text color="muted" fontSize="sm">
                    Latest Submission
                  </Text>
                </Skeleton>
                <Skeleton isLoaded={!isFetchingData}>
                  {state.stats?.latestSubmission ? (
                    <SubmissionBox
                      noOfLines={1}
                      question={state.stats.latestSubmission.question}
                      submission={state.stats.latestSubmission.submission}
                      withBox={false}
                    />
                  ) : (
                    <Heading size="sm">-</Heading>
                  )}
                </Skeleton>
              </Stack>
            </Card>
          </SimpleGrid>
          <Card>
            <Banner
              message="Keep an eye on this section for an exciting upcoming feature!"
              title="Coming soon."
            />
          </Card>
        </Stack>
      </Stack>
    </Page>
  );
};
