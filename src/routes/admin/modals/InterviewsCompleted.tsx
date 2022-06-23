import { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { UserProfileButton } from 'components/userProfile';
import { RecordWithPartner } from 'types/models/record';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  records: RecordWithPartner[];
}

export const InterviewsCompleted = ({
  isOpen,
  onClose,
  records,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${records.length} ${
        records.length === 1 ? 'Interview' : 'Interviews'
      } Completed`}
    >
      <Stack direction="column" spacing={2}>
        {records.map((record) => (
          <UserProfileButton key={record.id} user={record.partner} />
        ))}
      </Stack>
    </Modal>
  );
};
