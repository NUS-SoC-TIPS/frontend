/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ReactElement, useEffect, useReducer } from 'react';
import { Button, Flex, Stack, StackDivider, useToast } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { getQuestions } from 'lib/questions';
import { createSubmission } from 'lib/submissions';
import { Language } from 'types/models/code';
import { Question } from 'types/models/question';
import { SubmissionWithQuestion } from 'types/models/submission';
import { compareIdsAscending } from 'utils/sortUtils';

import {
  CodeFormControl,
  DifficultyFormControl,
  LanguageFormControl,
  NameFormControl,
  UrlFormControl,
} from './form';

interface Props {
  onBack: () => void;
  onCreate: (submission: SubmissionWithQuestion) => void;
}

interface State {
  questions: Question[];
  isLoading: boolean;
  isAdding: boolean;
  isError: boolean;
  selectedQuestion: Question | null;
  languageUsed: Language | null;
  codeWritten: string;
}

interface QuestionOption {
  value: string;
  label: string;
}

export const AddQuestion = ({
  onBack,
  onCreate,
}: Props): ReactElement<Props, typeof Page> => {
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

  useEffect(() => {
    let didCancel = false;
    const fetchData = async (): Promise<void> => {
      try {
        const questions = await getQuestions();
        questions.sort(compareIdsAscending);
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
        onCreate({ ...data, question: state.selectedQuestion! });
        toast({
          ...DEFAULT_TOAST_PROPS,
          title: 'Question added!',
          description: 'Awesome work with the question!',
          status: 'success',
        });
        onBack();
      })
      .catch((): void => {
        toast(ERROR_TOAST_PROPS);
        setState({ isAdding: false });
      });
  };

  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={onBack} variant="primary">
            Back
          </Button>
        }
        heading="Add a Question"
        subheading="Note: This should be done AFTER you complete the question on the
        respective platform, e.g. LeetCode."
      >
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
              onChange={(codeWritten): void => setState({ codeWritten })}
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
