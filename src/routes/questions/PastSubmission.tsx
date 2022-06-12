import { ReactElement, useReducer } from 'react';
import {
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  StackDivider,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';

import { Page } from 'components/page';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from 'constants/toast';
import { updateSubmission } from 'lib/submissions';
import { Language } from 'types/models/code';
import { SubmissionWithQuestion } from 'types/models/submission';
import { formatDate } from 'utils/dateUtils';
import { emptyFunction } from 'utils/functionUtils';

import {
  CodeFormControl,
  DifficultyFormControl,
  LanguageFormControl,
  NameFormControl,
  UrlFormControl,
} from './form';

interface Props {
  submission: SubmissionWithQuestion;
}

interface State {
  isUpdating: boolean;
  originalLanguageUsed: Language;
  languageUsed: Language | null;
  originalCodeWritten: string;
  codeWritten: string;
}

export const PastSubmission = ({
  submission,
}: Props): ReactElement<Props, typeof Page> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      isUpdating: false,
      originalLanguageUsed: submission.languageUsed,
      languageUsed: submission.languageUsed,
      originalCodeWritten: submission.codeWritten,
      codeWritten: submission.codeWritten,
    } as State,
  );
  const toast = useToast();

  const cannotUpdate = (): boolean => {
    return (
      state.languageUsed == null ||
      state.codeWritten === '' ||
      (state.languageUsed === state.originalLanguageUsed &&
        state.codeWritten === state.originalCodeWritten)
    );
  };

  const onUpdate = (): Promise<void> => {
    setState({ isUpdating: true });
    return updateSubmission(submission.id, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      languageUsed: state.languageUsed!,
      codeWritten: state.codeWritten,
    })
      .then((data): void => {
        setState({
          originalLanguageUsed: data.languageUsed,
          originalCodeWritten: data.codeWritten,
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

  return (
    <Page>
      <Stack spacing={5}>
        <Heading
          fontWeight="medium"
          size={useBreakpointValue({ base: 'xs', lg: 'sm' })}
        >
          Submission on {formatDate(submission.createdAt)}
        </Heading>
        <Divider />
        <Stack divider={<StackDivider />} spacing={5}>
          <NameFormControl
            defaultQuestion={submission.question}
            isDisabled={true}
            isError={false}
            isLoading={false}
            onChange={emptyFunction}
            questions={[submission.question]}
            selectedQuestion={submission.question}
          />
          <UrlFormControl question={submission.question} />
          <DifficultyFormControl question={submission.question} />
          <LanguageFormControl
            defaultLanguage={submission.languageUsed}
            onChangeLanguage={(languageUsed): void =>
              setState({ languageUsed })
            }
            question={submission.question}
          />
          <CodeFormControl
            code={state.codeWritten}
            language={state.languageUsed}
            onChange={(codeWritten): void => setState({ codeWritten })}
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
      </Stack>
    </Page>
  );
};
