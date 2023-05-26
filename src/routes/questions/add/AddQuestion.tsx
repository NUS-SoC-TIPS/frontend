/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ReactElement, useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';

import { ErrorBanner } from 'components/errorBanner';
import { Dashboard, Page } from 'components/page';
import { PAST_SUBMISSION, QUESTIONS } from 'constants/routes';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { createSubmission, getQuestions } from 'lib/questions';
import { QuestionListItem } from 'types/api/questions';
import { Language } from 'types/models/code';
import { compareNamesAscending } from 'utils/sortUtils';

import {
  CodeFormControl,
  DifficultyFormControl,
  LanguageFormControl,
  NameFormControl,
  UrlFormControl,
} from '../components/form';

interface State {
  questions: QuestionListItem[];
  isLoading: boolean;
  isAdding: boolean;
  isError: boolean;
  selectedQuestion: QuestionListItem | null;
  languageUsed: Language | null;
  codeWritten: string;
}

interface QuestionOption {
  value: string;
  label: string;
}

export const AddQuestion = (): ReactElement<void, typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      questions: [],
      isLoading: true,
      isAdding: false,
      isError: false,
      selectedQuestion: null,
      languageUsed: null,
      codeWritten: '',
    } as State,
  );
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let didCancel = false;
    const fetchData = async (): Promise<void> => {
      try {
        const questions = await getQuestions();
        questions.sort(compareNamesAscending);
        if (!didCancel) {
          setState({ questions, isLoading: false });
        }
      } catch {
        if (!didCancel) {
          setState({ isLoading: false, isError: true });
        }
      }
    };

    fetchData();

    return () => {
      didCancel = true;
    };
  }, []);

  const onChangeAsyncSelect = (newValue: unknown): void => {
    const selectedQuestion =
      state.questions.find(
        (q) => q.slug === (newValue as QuestionOption)?.value,
      ) ?? null;
    setState({ selectedQuestion });
  };

  const cannotAdd = (): boolean => {
    return (
      state.selectedQuestion == null ||
      state.languageUsed == null ||
      state.codeWritten.trim() === ''
    );
  };

  const onAdd = (): Promise<void> => {
    setState({ isAdding: true });
    return createSubmission({
      questionSlug: state.selectedQuestion!.slug,
      questionSource: state.selectedQuestion!.source,
      languageUsed: state.languageUsed!,
      codeWritten: state.codeWritten.trim(),
    })
      .then((data): void => {
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Question added!',
          description: 'Awesome work with the question!',
          status: 'success',
        });
        setTimeout(() => navigate(`${PAST_SUBMISSION}/${data.id}`), 1000);
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isAdding: false });
      });
  };

  const onChangeCode = useCallback((codeWritten: string): void => {
    setState({ codeWritten });
  }, []);

  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={(): void => navigate(QUESTIONS)} variant="primary">
            Back to Questions
          </Button>
        }
        heading="Add a Question"
        subheading="Note: This should be done AFTER you complete the question on the
        respective platform, e.g. LeetCode."
      >
        {state.isError && <ErrorBanner />}
        <Stack divider={<StackDivider />} spacing={5}>
          <NameFormControl {...state} onChange={onChangeAsyncSelect} />
          {state.selectedQuestion && (
            <UrlFormControl question={state.selectedQuestion} />
          )}
          {state.selectedQuestion && (
            <DifficultyFormControl question={state.selectedQuestion} />
          )}
          {state.selectedQuestion && (
            <LanguageFormControl
              onChangeLanguage={(languageUsed): void =>
                setState({ languageUsed })
              }
              question={state.selectedQuestion}
            />
          )}
          {state.selectedQuestion && (
            <CodeFormControl
              code={state.codeWritten}
              language={state.languageUsed}
              onChange={onChangeCode}
            />
          )}
          {state.selectedQuestion && (
            <Flex direction="row-reverse">
              <Button
                isDisabled={cannotAdd()}
                isLoading={state.isAdding}
                onClick={onAdd}
                variant="primary"
              >
                Add Question
              </Button>
            </Flex>
          )}
        </Stack>
      </Dashboard>
    </Page>
  );
};
