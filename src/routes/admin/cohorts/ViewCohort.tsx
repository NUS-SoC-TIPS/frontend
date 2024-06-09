import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';

import { ErrorBanner } from '@/components/errorBanner';
import { ADD_STUDENTS, VIEW_WINDOW } from '@/constants/routes';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from '@/constants/toast';
import {
  COHORT_EMAIL_SUFFIX,
  COURSEMOLOGY_COURSE_URL_PREFIX,
} from '@/constants/urls';
import {
  createWindowAdmin,
  getCohortAdmin,
  rematchWindows,
  updateCohortAdmin,
  updateWindowAdmin,
} from '@/lib/admin';
import { CohortAdminItem } from '@/types/api/admin';
import { ExcuseBase } from '@/types/api/excuses';
import { WindowBase } from '@/types/api/windows';
import {
  stripPrefixForUrlField,
  stripSuffixForEmailField,
} from '@/utils/cohortUtils';
import { changeToUserTimezone } from '@/utils/dateUtils';
import { compareStartAtsDescending } from '@/utils/sortUtils';

import { NameFormControl, UrlFormControl } from '../components/form';
import { EmailFormControl } from '../components/form/EmailFormControl';

import { ConfirmRematchWindows, WindowModal } from './modals';
import { ExcuseTable, StudentTable, WindowTable } from './tables';
import { ViewCohortPage } from './ViewCohortPage';
import { ViewCohortSkeleton } from './ViewCohortSkeleton';

interface State {
  cohort: CohortAdminItem | null;
  name: string;
  coursemologyUrl: string;
  email: string;
  isError: boolean;
  isUpdatingBasicInfo: boolean;
  isUpdatingOrCreatingWindow: boolean;
  isRematchingWindows: boolean;
  isRematchWindowsModalShown: boolean;
  selectedWindow: (Omit<WindowBase, 'id'> & { id: number | null }) | null;
}

const mockExcuses = [
  {
    id: 1,
    user: {
      name: 'Dev User',
      githubUsername: 'straight-best-actor',
      profileUrl: 'https://github.com',
      photoUrl:
        'https://res.cloudinary.com/folio-hnr/image/upload/v1679629122/blob_ycezgh.jpg',
    },
    excuseFrom: 'interview_and_question',
    excuseReason: 'I am sick',
    status: 'pending',
  },
  {
    id: 2,
    user: {
      name: 'Shenyi Cui',
      githubUsername: 'gay-best-actor',
      profileUrl: 'https://github.com',
      photoUrl: 'https://avatars.githubusercontent.com/u/29945147?v=4',
    },
    excuseFrom: 'interview',
    excuseReason:
      'I am going on a holiday really far away, this is a super long piece of text that should be truncated at some point in time',
    status: 'rejected',
  },
] as ExcuseBase[];

export const ViewCohort = (): ReactElement<void, typeof ViewCohortPage> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      cohort: null,
      name: '',
      coursemologyUrl: '',
      email: '',
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
        const cohort = await getCohortAdmin(+id)
          .then(stripPrefixForUrlField)
          .then(stripSuffixForEmailField);
        cohort.windows.sort(compareStartAtsDescending);
        if (!didCancel) {
          setState({
            cohort,
            name: cohort.name,
            coursemologyUrl: cohort.coursemologyUrl,
            email: cohort.email,
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

  const { name, coursemologyUrl, email, cohort, isError, selectedWindow } =
    state;

  const cannotUpdateBasicInfo = (): boolean => {
    return (
      (name === cohort?.name &&
        coursemologyUrl === cohort?.coursemologyUrl &&
        email === cohort?.email) ||
      name.trim() === '' ||
      coursemologyUrl.trim() === '' ||
      email.trim() === ''
    );
  };

  const onUpdateBasicInfo = (): Promise<void> => {
    if (cohort == null) {
      return Promise.resolve();
    }
    setState({ isUpdatingBasicInfo: true });
    return updateCohortAdmin(cohort.id, {
      name,
      coursemologyUrl: COURSEMOLOGY_COURSE_URL_PREFIX + coursemologyUrl.trim(),
      email: email.trim() + COHORT_EMAIL_SUFFIX,
    })
      .then(stripPrefixForUrlField)
      .then(stripSuffixForEmailField)
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
            email: data.email,
          },
          name: data.name,
          coursemologyUrl: data.coursemologyUrl,
          email: data.email,
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
      setState({ isUpdatingOrCreatingWindow: true });
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

  const onConfirmRematchWindows = (): Promise<void> => {
    if (cohort == null) {
      toast(ERROR_TOAST_PROPS);
      return Promise.resolve();
    }
    setState({ isRematchingWindows: true });
    return rematchWindows(cohort.id)
      .then((): void => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Windows rematched!',
          description:
            'Students will be seeing the updated information immediately.',
          status: 'success',
        });
        setState({
          isRematchingWindows: false,
          isRematchWindowsModalShown: false,
        });
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({
          isRematchingWindows: false,
          isRematchWindowsModalShown: false,
        });
      });
  };

  if (isError || id == null) {
    return (
      <ViewCohortPage>
        <ErrorBanner />
      </ViewCohortPage>
    );
  }

  if (cohort == null) {
    return <ViewCohortSkeleton />;
  }

  return (
    <ViewCohortPage
      isRematchingWindows={state.isRematchingWindows}
      onRematchWindows={(): void =>
        setState({ isRematchWindowsModalShown: true })
      }
    >
      <Stack spacing={12}>
        <Stack divider={<StackDivider />} spacing={5}>
          <NameFormControl
            name={state.name}
            onChange={(name: string): void => setState({ name })}
          />
          <UrlFormControl
            onChange={(url: string): void => setState({ coursemologyUrl: url })}
            url={state.coursemologyUrl}
          />
          <EmailFormControl
            email={state.email}
            onChange={(email: string): void => setState({ email })}
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
        <ExcuseTable
          excuses={mockExcuses}
          onView={(id: number): number => id}
        />
      </Stack>
      <ConfirmRematchWindows
        isLoading={state.isRematchingWindows}
        isOpen={state.isRematchWindowsModalShown}
        onClose={(): void => setState({ isRematchWindowsModalShown: false })}
        onConfirmRematchWindows={onConfirmRematchWindows}
      />
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
    </ViewCohortPage>
  );
};
