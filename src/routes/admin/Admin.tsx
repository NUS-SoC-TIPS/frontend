import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorBanner } from 'components/errorBanner';
import { COHORT } from 'constants/routes';
import { getOverviewAdmin } from 'lib/admin';
import { AdminOverview } from 'types/api/admin';

import { AdminPage } from './AdminPage';
import { CohortTable, NonStudentTable } from './tables';

interface State {
  overview: AdminOverview | null;
  isError: boolean;
}

export const Admin = (): ReactElement<typeof AdminPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>) => ({ ...s, ...a }),
    { overview: null, isError: false } as State,
  );
  const navigate = useNavigate();

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): Promise<void> => {
      return getOverviewAdmin()
        .then((overview) => {
          if (!didCancel) {
            setState({ overview });
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

  const { isError, overview } = state;

  if (overview == null) {
    // TODO: Return overview
    return <></>;
  }

  if (isError) {
    return (
      <AdminPage>
        <ErrorBanner maxW="100%" px={0} />
      </AdminPage>
    );
  }

  const onView = (id: number): void => navigate(`${COHORT}/${id}`);

  return (
    <AdminPage>
      <CohortTable cohorts={overview.cohorts} onView={onView} />
      <NonStudentTable users={overview.nonStudents} />
    </AdminPage>
  );
};
