import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Stack } from '@chakra-ui/react';

import { ErrorBanner } from 'components/errorBanner';
import { Page } from 'components/page';
import { TASKS_BREAKDOWN } from 'constants/routes';
import { getCohorts } from 'lib/tasks';
import { CohortListItem } from 'types/api/cohorts';

import { CohortCard } from './CohortCard';
import { TasksPage } from './TasksPage';
import { TasksSkeleton } from './TasksSkeleton';

interface State {
  isError: boolean;
  cohorts: CohortListItem[] | null;
}

export const Tasks = (): ReactElement<typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    { isError: false, cohorts: null } as State,
  );
  const navigate = useNavigate();

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getCohorts()
        .then((cohorts) => {
          if (!didCancel) {
            setState({ cohorts });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({ isError: true });
          }
        });
    };

    fetchData();

    return (): void => {
      didCancel = true;
    };
  }, []);

  const { cohorts, isError } = state;

  if (isError) {
    return (
      <TasksPage>
        <ErrorBanner maxW="100%" px={0} />
      </TasksPage>
    );
  }

  if (cohorts == null) {
    return <TasksSkeleton />;
  }

  return (
    <TasksPage>
      <Container maxW="3xl" px={0}>
        <Stack flex="1" spacing="5">
          {cohorts.map((cohort) => (
            <CohortCard
              cohort={cohort}
              key={cohort.id}
              onClick={(id: number): void => {
                navigate(`${TASKS_BREAKDOWN}/${id}`);
              }}
            />
          ))}
        </Stack>
      </Container>
    </TasksPage>
  );
};
