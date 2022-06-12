import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { SubmissionBox } from 'components/submission';
import { SubmissionWithQuestion } from 'types/models/submission';

interface Props {
  submission: SubmissionWithQuestion | null;
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
            withBox={false}
          />
        ) : (
          <Heading size="sm">-</Heading>
        )}
      </Stack>
    </Card>
  );
};
