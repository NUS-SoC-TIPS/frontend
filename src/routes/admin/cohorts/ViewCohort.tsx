import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { ADD_STUDENTS, ADMIN } from 'constants/routes';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { COURSEMOLOGY_COURSE_URL_PREFIX } from 'constants/urls';
import { getCohortAdmin, updateCohortAdmin } from 'lib/admin';
import { CohortAdminItem } from 'types/api/admin';
import { WindowBase } from 'types/api/windows';
import { stripPrefixForUrlField } from 'utils/cohortUtils';

import { NameFormControl, UrlFormControl } from '../components/form';

import { StudentTable, WindowTable } from './tables';

interface State {
  cohort: CohortAdminItem | null;
  name: string;
  coursemologyUrl: string;
  isError: boolean;
  isUpdatingBasicInfo: boolean;
  isCreatingOrUpdatingWindow: boolean;
  selectedWindow: (Omit<WindowBase, 'id'> & { id: number | null }) | null;
}

export const ViewCohort = (): ReactElement<void, typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      cohort: null,
      name: '',
      coursemologyUrl: '',
      isError: false,
      isUpdatingBasicInfo: false,
      isCreatingOrUpdatingWindow: false,
      selectedWindow: null,
    } as State,
  );
  const toast = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    let didCancel = false;
    const fetchData = async (): Promise<void> => {
      if (id == null) {
        return;
      }
      try {
        const cohort = await getCohortAdmin(+id).then(stripPrefixForUrlField);
        if (!didCancel) {
          setState({
            cohort,
            name: cohort.name,
            coursemologyUrl: cohort.coursemologyUrl,
          });
        }
      } catch {
        if (!didCancel) {
          setState({ isError: true });
        }
      }
    };
    fetchData();

    return () => {
      didCancel = true;
    };
  }, [id]);

  const cannotUpdateBasicInfo = (): boolean => {
    return (
      (state.name === state.cohort?.name &&
        state.coursemologyUrl === state.cohort?.coursemologyUrl) ||
      state.name.trim() === '' ||
      state.coursemologyUrl.trim() === ''
    );
  };

  const onUpdateBasicInfo = (): Promise<void> => {
    const { cohort } = state;
    if (cohort == null) {
      return Promise.resolve();
    }
    setState({ isUpdatingBasicInfo: true });
    return updateCohortAdmin(cohort.id, {
      name: state.name,
      coursemologyUrl: COURSEMOLOGY_COURSE_URL_PREFIX + state.coursemologyUrl,
    })
      .then(stripPrefixForUrlField)
      .then((data): void => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Cohort updated!',
          description:
            'Students will be seeing the updated information immediately.',
          status: 'success',
        });
        const { name, coursemologyUrl } = data;
        setState({
          cohort: { ...cohort, name, coursemologyUrl },
          name,
          coursemologyUrl,
          isUpdatingBasicInfo: false,
        });
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isUpdatingBasicInfo: false });
      });
  };

  const onEditWindow = (id: number): void => {
    setState({
      selectedWindow:
        state.cohort?.windows?.filter((window) => window.id === id)?.[0] ??
        null,
    });
  };

  const onAddWindow = (): void => {
    const windows = state.cohort?.windows ?? [];
    const startAt = windows[windows.length - 1].endAt ?? new Date();
    startAt.setDate(startAt.getDate() + 1);
    const endAt = new Date(startAt);
    endAt.setDate(startAt.getDate() + 6);
    setState({
      selectedWindow: {
        id: null,
        startAt,
        endAt,
        numQuestions: 6,
        requireInterview: false,
      },
    });
  };

  const { cohort } = state;

  if (cohort == null) {
    // TODO: Add loading state
    return <></>;
  }

  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={(): void => navigate(ADMIN)} variant="secondary">
            Back to Admin
          </Button>
        }
        heading="Viewing Cohort"
        subheading="View and update the basic information, windows and students of a cohort here."
      >
        <Stack spacing={12}>
          <Stack divider={<StackDivider />} spacing={5}>
            <NameFormControl
              name={state.name}
              onChange={(name: string): void => setState({ name })}
            />
            <UrlFormControl
              onChange={(url: string): void =>
                setState({ coursemologyUrl: url })
              }
              url={state.coursemologyUrl}
            />
            <Flex direction="row-reverse">
              <Button
                isDisabled={cannotUpdateBasicInfo()}
                isLoading={state.isUpdatingBasicInfo}
                onClick={onUpdateBasicInfo}
                variant="primary"
              >
                Update Basic Info
              </Button>
            </Flex>
          </Stack>
          <StudentTable
            onAdd={(): void => navigate(`${ADD_STUDENTS}/${id}`)}
            students={cohort.students}
          />
          <WindowTable
            onAdd={onAddWindow}
            onEdit={onEditWindow}
            windows={cohort.windows}
          />
        </Stack>
      </Dashboard>
    </Page>
  );
};
