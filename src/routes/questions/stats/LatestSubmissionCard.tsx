import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { SubmissionBox } from 'components/submission';
import { SubmissionQuestionData } from 'types/api/stats';

interface Props {
  submission: SubmissionQuestionData | null;
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
            submission={submission.submission}
            withBox={false}
          />
        ) : (
          <Heading size="sm">-</Heading>
        )}
      </Stack>
    </Card>
  );
};
