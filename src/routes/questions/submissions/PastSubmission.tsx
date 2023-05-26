import { ReactElement, useCallback, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';

import { ErrorBanner } from 'components/errorBanner';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { getSubmission, updateSubmission } from 'lib/questions';
import { SubmissionItem } from 'types/api/questions';
import { Language } from 'types/models/code';
import { formatDateWithYear } from 'utils/dateUtils';
import { emptyFunction } from 'utils/functionUtils';

import {
  CodeFormControl,
  DifficultyFormControl,
  LanguageFormControl,
  NameFormControl,
  UrlFormControl,
} from '../components/form';

import { PastSubmissionPage } from './PastSubmissionPage';
import { PastSubmissionSkeleton } from './PastSubmissionSkeleton';

interface State {
  id: number; // Used to force the re-rendering of the code input upon save
  isUpdating: boolean;
  isError: boolean;
  languageUsed: Language | null;
  codeWritten: string;
  originalSubmission: SubmissionItem | null;
}

export const PastSubmission = (): ReactElement<
  void,
  typeof PastSubmissionPage
> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      id: 0,
      isUpdating: false,
      isError: false,
      languageUsed: null,
      codeWritten: '',
      originalSubmission: null,
    } as State,
  );
  const toast = useToast();
  const { id } = useParams();

  useEffect(() => {
    let didCancel = false;
    const fetchData = async (): Promise<void> => {
      if (id == null) {
        return;
      }
      try {
        const originalSubmission = await getSubmission(+id);
        if (!didCancel) {
          setState({
            originalSubmission,
            languageUsed: originalSubmission.languageUsed,
            codeWritten: originalSubmission.codeWritten,
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

  const cannotUpdate = (): boolean => {
    return (
      state.languageUsed == null ||
      state.codeWritten.trim() === '' ||
      (state.languageUsed === state.originalSubmission?.languageUsed &&
        state.codeWritten.trim() ===
          state.originalSubmission.codeWritten.trim())
    );
  };

  const onUpdate = (): Promise<void> => {
    const { originalSubmission, languageUsed } = state;
    if (originalSubmission == null || languageUsed == null) {
      return Promise.resolve();
    }
    setState({ isUpdating: true });
    return updateSubmission(originalSubmission.id, {
      languageUsed,
      codeWritten: state.codeWritten.trim(),
    })
      .then((data): void => {
        setState({
          id: state.id + 1,
          originalSubmission: {
            ...originalSubmission,
            languageUsed,
            codeWritten: data.codeWritten,
          },
          // We update this as string trimming may occur upon saving, which causes the
          // codeWritten to differ from the originalCodeWritten.
          codeWritten: data.codeWritten,
          isUpdating: false,
        });
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Submission updated!',
          description: 'Keep up the good work!',
          status: 'success',
        });
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isUpdating: false });
      });
  };

  const onChangeCode = useCallback((codeWritten: string): void => {
    setState({ codeWritten });
  }, []);

  const { originalSubmission, isError } = state;

  if (isError) {
    <PastSubmissionPage subheading="Failed to load your submission!">
      <ErrorBanner maxW="100%" px={0} />
    </PastSubmissionPage>;
  }

  if (originalSubmission == null) {
    return <PastSubmissionSkeleton />;
  }

  return (
    <PastSubmissionPage
      heading={`Submission for ${originalSubmission.question.name}`}
      subheading={`Submitted on ${formatDateWithYear(
        originalSubmission.submittedAt,
      )}`}
    >
      <Stack divider={<StackDivider />} spacing={5}>
        <NameFormControl
          defaultQuestion={originalSubmission.question}
          isDisabled={true}
          isError={false}
          isLoading={false}
          onChange={emptyFunction}
          questions={[originalSubmission.question]}
          selectedQuestion={originalSubmission.question}
        />
        <UrlFormControl question={originalSubmission.question} />
        <DifficultyFormControl question={originalSubmission.question} />
        <LanguageFormControl
          defaultLanguage={originalSubmission.languageUsed}
          onChangeLanguage={(languageUsed): void => setState({ languageUsed })}
          question={originalSubmission.question}
        />
        <CodeFormControl
          code={state.codeWritten}
          key={state.id}
          language={state.languageUsed}
          onChange={onChangeCode}
        />
        <Flex direction="row-reverse">
          <Button
            isDisabled={cannotUpdate()}
            isLoading={state.isUpdating}
            onClick={onUpdate}
            variant="primary"
          >
            Update Submission
          </Button>
        </Flex>
      </Stack>
    </PastSubmissionPage>
  );
};
