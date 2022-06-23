import { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { QuestionBoxHighlight } from 'components/question';
import { SubmissionWithQuestion } from 'types/models/submission';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  submissions: SubmissionWithQuestion[];
}

export const QuestionsCompleted = ({
  isOpen,
  onClose,
  submissions,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${submissions.length} ${
        submissions.length === 1 ? 'Question' : 'Questions'
      } Completed`}
    >
      <Stack direction="column" spacing={2}>
        {submissions.map((submission) => (
          <QuestionBoxHighlight
            key={submission.id}
            question={submission.question}
          />
        ))}
      </Stack>
    </Modal>
  );
};
