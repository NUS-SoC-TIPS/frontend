import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { SubmissionBox } from 'components/submission';
import { Question } from 'types/models/question';
import { QuestionSubmission } from 'types/models/submission';

interface Props {
  submission:
    | (QuestionSubmission & {
        question: Question;
      })
    | null;
}

export const LatestSubmissionCard = ({
  submission,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <Card>
      <Stack>
        <Text color="muted" fontSize="sm">
          Latest Submission
        </Text>
        {submission ? (
          <SubmissionBox
            noOfLines={1}
            question={submission.question}
            submission={submission}
            withBox={false}
          />
        ) : (
          <Heading size="sm">-</Heading>
        )}
      </Stack>
    </Card>
  );
};
