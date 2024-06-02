import { ReactElement } from 'react';
import { Button, Stack, Text } from '@chakra-ui/react';

import { Modal } from '@/components/modal';
import { emptyFunction } from '@/utils/functionUtils';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  name: string;
  onConfirmInclude: () => void | Promise<void>;
}

export const ConfirmInclusion = ({
  isOpen,
  isLoading,
  onClose,
  name,
  onConfirmInclude,
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
            onClick={onConfirmInclude}
            variant="primary"
          >
            Include
          </Button>
        </Stack>
      }
      isOpen={isOpen}
      onClose={isLoading ? emptyFunction : onClose}
      title={`Include ${name}?`}
    >
      <Text>Are you sure you wish to include {name}?</Text>
    </Modal>
  );
};
