import { ReactElement } from 'react';
import { Stack } from '@chakra-ui/react';

import { Modal } from '@/components/modal';
import { UserProfileHighlight } from '@/components/userProfile';
import { StudentBase } from '@/types/api/students';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  partner: StudentBase | null;
}

export const PairedPartner = ({
  isOpen,
  onClose,
  partner,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior="inside"
      title="Paired Partner"
    >
      <Stack direction="column" spacing={2}>
        {partner && <UserProfileHighlight user={partner} />}
      </Stack>
    </Modal>
  );
};
