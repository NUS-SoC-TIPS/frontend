import { ReactElement } from 'react';
import { Heading, Skeleton, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { SubmissionBox } from 'components/submission';
import { SubmissionQuestionData } from 'types/api/stats';

interface Props {
  isLoaded: boolean;
  submission: SubmissionQuestionData | null | undefined;
}

export const LatestSubmissionCard = ({
  isLoaded,
  submission,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <Card>
      <Stack>
        <Skeleton isLoaded={isLoaded}>
          <Text color="muted" fontSize="sm">
            Latest Submission
          </Text>
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>
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
        </Skeleton>
      </Stack>
    </Card>
  );
};
