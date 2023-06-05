import { ReactElement } from 'react';
import { Button, Stack, Text } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { emptyFunction } from 'utils/functionUtils';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirmPairStudents: () => void | Promise<void>;
}

export const ConfirmPairStudents = ({
  isOpen,
  isLoading,
  onClose,
  onConfirmPairStudents,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      actions={
        <Stack direction="row" spacing={2}>
          <Button isDisabled={isLoading} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onClick={onConfirmPairStudents}
            variant="primary"
          >
            Pair Students
          </Button>
        </Stack>
      }
      isOpen={isOpen}
      onClose={isLoading ? emptyFunction : onClose}
      size="md"
      title="Are you sure you wish to pair students?"
    >
      <Text>
        This will attempt to pair unpaired students who are not excluded.
      </Text>
    </Modal>
  );
};
