import { ReactElement } from 'react';
import { Button, Stack, Text } from '@chakra-ui/react';

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
        <Stack direction="row" spacing={2}>
          <Button isDisabled={isDeleting} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button colorScheme="red" isLoading={isDeleting} onClick={onConfirm}>
            Confirm
          </Button>
        </Stack>
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
