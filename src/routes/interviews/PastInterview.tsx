import { ReactElement } from 'react';
import {
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react';

import { SimpleCodeEditor } from 'components/codeEditor';
import { Dashboard, Page } from 'components/page';
import { languageToString } from 'constants/enumStrings';
import { RecordWithPartner } from 'types/models/record';
import { formatDate, formatDuration } from 'utils/dateUtils';

interface Props {
  interview: RecordWithPartner;
  onBack: () => void;
}

export const PastInterview = ({
  interview,
  onBack,
}: Props): ReactElement<Props, typeof Page> => {
  const {
    language,
    partner: { name },
    createdAt,
    codeWritten,
    notes,
    duration,
  } = interview;
  const height = useBreakpointValue(
    { base: '20rem', md: '30rem' },
    { fallback: 'md' },
  );
  const trimmedNotes = notes.trim();
  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={onBack} variant="primary">
            Back
          </Button>
        }
        heading={`Interview with ${name}`}
        subheading={`Completed on ${formatDate(createdAt)} in ${formatDuration(
          duration,
        )}`}
      >
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
          <Stack>
            <Heading fontWeight="medium" mb={0} size="xxs">
              Code Written in {languageToString[language]}
            </Heading>
            <SimpleCodeEditor
              height={height}
              language={language}
              value={codeWritten}
              width="100%"
            />
          </Stack>
          <Stack>
            <Heading fontWeight="medium" mb={0} size="xxs">
              Feedback from {name}
            </Heading>
            <Textarea
              color={notes !== '' ? undefined : 'muted'}
              height={height}
              maxHeight={height}
              readOnly={true}
              value={
                trimmedNotes.trim() !== ''
                  ? trimmedNotes
                  : 'Your partner did not leave any comments, unfortunately :('
              }
            />
          </Stack>
        </SimpleGrid>
        {interview.notes}
      </Dashboard>
    </Page>
  );
};
