/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';

import { Page } from 'components/page';
import { QUESTIONS } from 'constants/routes';
import { DEFAULT_TOAST_PROPS } from 'constants/toast';
import { getQuestions } from 'lib/questions';
import { createSubmission } from 'lib/submissions';
import { Language } from 'types/models/code';
import { Question } from 'types/models/question';

import {
  CodeFormControl,
  DifficultyFormControl,
  LanguageFormControl,
  NameFormControl,
  UrlFormControl,
} from './form';

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

export const AddQuestion = (): ReactElement<typeof Page> => {
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
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    let didCancel = false;
    const fetchData = async (): Promise<void> => {
      try {
        const questions = await getQuestions();
        questions.sort((a, b) => a.id - b.id);
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
      state.codeWritten === ''
    );
  };

  const onAdd = (): Promise<void> => {
    setState({ isAdding: true });
    return createSubmission({
      questionSlug: state.selectedQuestion!.slug,
      questionSource: state.selectedQuestion!.source,
      languageUsed: state.languageUsed!,
      codeWritten: state.codeWritten,
    }).then((): void => {
      toast({
        ...DEFAULT_TOAST_PROPS,
        title: 'Question added!',
        description: 'Awesome work with the question!',
        status: 'success',
      });
      navigate(QUESTIONS);
    });
  };

  return (
    <Page>
      <Stack spacing="5">
        <Stack spacing="1">
          <Heading
            fontWeight="medium"
            size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
          >
            Add a Question
          </Heading>
          <Text color="muted">
            Note: This should be done AFTER you complete the question on the
            respective platform, e.g. LeetCode.
          </Text>
        </Stack>
        <Divider />
        <Stack divider={<StackDivider />} spacing="5">
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
      </Stack>
    </Page>
  );
};
