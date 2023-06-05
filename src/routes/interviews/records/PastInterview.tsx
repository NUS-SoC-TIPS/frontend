import { ReactElement, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import {
  Heading,
  SimpleGrid,
  Stack,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react';

import { SimpleCodeEditor } from 'components/codeEditor';
import { ErrorBanner } from 'components/errorBanner';
import { LANGUAGE_TO_STRING } from 'constants/enumStrings';
import { getInterview } from 'lib/interviews';
import { InterviewItem } from 'types/api/interviews';
import { formatDateWithYear, formatDuration } from 'utils/dateUtils';

import { PastInterviewPage } from './PastInterviewPage';
import { PastInterviewSkeleton } from './PastInterviewSkeleton';

interface State {
  isError: boolean;
  interview: InterviewItem | null;
}

export const PastInterview = (): ReactElement<
  void,
  typeof PastInterviewPage
> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    { isError: false, interview: null } as State,
  );
  const height = useBreakpointValue(
    { base: '20rem', md: '30rem' },
    { ssr: false },
  );
  const { id } = useParams();

  useEffect(() => {
    let didCancel = false;
    const fetchData = async (): Promise<void> => {
      if (id == null) {
        return;
      }
      try {
        const interview = await getInterview(+id);
        if (!didCancel) {
          setState({ interview });
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

  const { interview, isError } = state;

  if (isError || id == null) {
    <PastInterviewPage subheading="Failed to load your interview!">
      <ErrorBanner maxW="100%" px={0} />
    </PastInterviewPage>;
  }

  if (interview == null) {
    return <PastInterviewSkeleton />;
  }

  const notes = interview.partner.notes.trim();

  return (
    <PastInterviewPage
      heading={`Interview with ${interview.partner.name}`}
      subheading={`Completed at ${formatDateWithYear(
        interview.completedAt,
      )} in ${formatDuration(interview.duration)}`}
    >
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
        <Stack>
          <Heading fontWeight="medium" mb={0} size="xxs">
            Code Written in {LANGUAGE_TO_STRING[interview.language]}
          </Heading>
          <SimpleCodeEditor
            height={height}
            language={interview.language}
            value={interview.codeWritten}
            width="100%"
          />
        </Stack>
        <Stack>
          <Heading fontWeight="medium" mb={0} size="xxs">
            Feedback from {interview.partner.name}
          </Heading>
          <Textarea
            color={interview.partner.notes !== '' ? undefined : 'muted'}
            height={height}
            maxHeight={height}
            readOnly={true}
            value={
              notes !== ''
                ? notes
                : 'Your partner did not leave any comments, unfortunately :('
            }
          />
        </Stack>
      </SimpleGrid>
      {notes}
    </PastInterviewPage>
  );
};
