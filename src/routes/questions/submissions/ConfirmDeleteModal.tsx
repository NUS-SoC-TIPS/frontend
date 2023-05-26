import { ReactElement } from 'react';
import { Button, Text } from '@chakra-ui/react';

import { Modal } from 'components/modal';

interface Props {
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export const ConfirmDeleteModal = ({
  isOpen,
  isDeleting,
  onConfirm,
  onClose,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      actions={
        <>
          <Button
            isDisabled={isDeleting}
            mr={2}
            onClick={onClose}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button colorScheme="red" isLoading={isDeleting} onClick={onConfirm}>
            Confirm
          </Button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Are you sure you wish to delete this submission?"
    >
      <Text mb={3}>
        Note that if you&apos;re currently in the middle of a cohort, this may
        affect your completion.
      </Text>
      <Text mb={3}>You will also not be able to undo this operation.</Text>
    </Modal>
  );
};
