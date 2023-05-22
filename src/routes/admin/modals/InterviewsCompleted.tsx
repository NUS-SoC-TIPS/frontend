import { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { UserProfileHighlight } from 'components/userProfile';
import { InterviewBase } from 'types/api/interviews';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  interviews: InterviewBase[];
}

export const InterviewsCompleted = ({
  isOpen,
  onClose,
  interviews,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      title={`${interviews.length} ${
        interviews.length === 1 ? 'Interview' : 'Interviews'
      } Completed`}
    >
      <Stack direction="column" spacing={2}>
        {interviews.map((interview) => (
          <UserProfileHighlight key={interview.id} user={interview.partner} />
        ))}
      </Stack>
    </Modal>
  );
};
