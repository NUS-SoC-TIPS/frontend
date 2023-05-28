import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { ADD_STUDENTS, ADMIN, VIEW_WINDOW } from 'constants/routes';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { COURSEMOLOGY_COURSE_URL_PREFIX } from 'constants/urls';
import {
  createWindowAdmin,
  getCohortAdmin,
  updateCohortAdmin,
  updateWindowAdmin,
} from 'lib/admin';
import { CohortAdminItem } from 'types/api/admin';
import { WindowBase } from 'types/api/windows';
import { stripPrefixForUrlField } from 'utils/cohortUtils';
import { changeToUserTimezone } from 'utils/dateUtils';
import { compareStartAtsDescending } from 'utils/sortUtils';

import { NameFormControl, UrlFormControl } from '../components/form';

import { StudentTable, WindowTable } from './tables';
import { WindowModal } from './WindowModal';

interface State {
  cohort: CohortAdminItem | null;
  name: string;
  coursemologyUrl: string;
  isError: boolean;
  isUpdatingBasicInfo: boolean;
  isUpdatingOrCreatingWindow: boolean;
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
        cohort.windows.sort(compareStartAtsDescending);
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

  const { name, coursemologyUrl, cohort, isError, selectedWindow } = state;

  const cannotUpdateBasicInfo = (): boolean => {
    return (
      (name === cohort?.name && coursemologyUrl === cohort?.coursemologyUrl) ||
      name.trim() === '' ||
      coursemologyUrl.trim() === ''
    );
  };

  const onUpdateBasicInfo = (): Promise<void> => {
    if (cohort == null) {
      return Promise.resolve();
    }
    setState({ isUpdatingBasicInfo: true });
    return updateCohortAdmin(cohort.id, {
      name: name,
      coursemologyUrl: COURSEMOLOGY_COURSE_URL_PREFIX + coursemologyUrl,
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
        setState({
          cohort: {
            ...cohort,
            name: data.name,
            coursemologyUrl: data.coursemologyUrl,
          },
          name: data.name,
          coursemologyUrl: data.coursemologyUrl,
          isUpdatingBasicInfo: false,
        });
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isUpdatingBasicInfo: false });
      });
  };

  const onEditWindow = (id: number): void => {
    const window = cohort?.windows?.filter((window) => window.id === id)?.[0];
    if (window == null) {
      setState({ selectedWindow: null });
      return;
    }
    setState({
      selectedWindow: {
        ...window,
        startAt: changeToUserTimezone(window.startAt),
        endAt: changeToUserTimezone(window.endAt),
      },
    });
  };

  const onAddWindow = (): void => {
    let startAt = state.cohort?.windows?.[0]?.endAt ?? new Date();
    startAt = new Date(startAt);
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

  const onSaveWindow = async (
    startAt: Date,
    endAt: Date,
    numQuestions: number,
    requireInterview: boolean,
  ): Promise<void> => {
    if (cohort == null || selectedWindow == null) {
      return;
    }
    const { id } = selectedWindow;
    let data;
    let newWindows = cohort.windows;
    try {
      if (id == null) {
        data = await createWindowAdmin(cohort.id, {
          startAt: startAt.toDateString(),
          endAt: endAt.toDateString(),
          numQuestions,
          requireInterview,
        });
        newWindows = [...newWindows, data];
      } else {
        data = await updateWindowAdmin(cohort.id, {
          id,
          startAt: startAt.toDateString(),
          endAt: endAt.toDateString(),
          numQuestions,
          requireInterview,
        });
        const index = newWindows.findIndex((window) => window.id === id);
        newWindows[index] = data;
      }
    } catch {
      toast(ERROR_TOAST_PROPS);
      setState({ isUpdatingOrCreatingWindow: false });
      return;
    }

    newWindows.sort(compareStartAtsDescending);
    toast({
      ...DEFAULT_TOAST_PROPS,
      title: id == null ? 'Window added!' : 'Window updated!',
      description:
        'Students will be seeing the updated information immediately.',
      status: 'success',
    });
    setState({
      cohort: {
        ...cohort,
        windows: newWindows,
      },
      isUpdatingOrCreatingWindow: false,
      selectedWindow: null,
    });
  };

  if (isError) {
    // TODO: Add error state
    return <></>;
  }

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
            onView={(id: number): void => navigate(`${VIEW_WINDOW}/${id}`)}
            windows={cohort.windows}
          />
        </Stack>
        <WindowModal
          endAt={selectedWindow?.endAt ?? new Date()}
          isCreate={selectedWindow?.id == null}
          isLoading={state.isUpdatingOrCreatingWindow}
          isOpen={selectedWindow != null}
          numQuestions={selectedWindow?.numQuestions ?? 6}
          onClose={(): void => setState({ selectedWindow: null })}
          onSave={onSaveWindow}
          otherWindows={
            cohort?.windows?.filter(
              (window) => window.id !== selectedWindow?.id,
            ) ?? []
          }
          requireInterview={selectedWindow?.requireInterview ?? false}
          startAt={selectedWindow?.startAt ?? new Date()}
        />
      </Dashboard>
    </Page>
  );
};
