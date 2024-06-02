import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from '@/components/card';
import { QuestionBox } from '@/components/question';
import { SubmissionListItem } from '@/types/api/questions';
import { formatDateWithYear } from '@/utils/dateUtils';

interface Props {
  submission: SubmissionListItem | null;
}

export const LatestSubmissionCard = ({
  submission,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <Card>
      <Stack>
        <Text color="fg.muted" fontSize="sm">
          Latest Submission
        </Text>
        <Stack spacing={4}>
          {submission ? (
            <QuestionBox
              noOfLines={1}
              question={submission.question}
              withBox={false}
            />
          ) : (
            <Heading size="sm">-</Heading>
          )}
          <Text color="fg.muted" fontWeight="medium">
            {submission
              ? `Submitted on ${formatDateWithYear(submission.submittedAt)}`
              : '-'}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};
