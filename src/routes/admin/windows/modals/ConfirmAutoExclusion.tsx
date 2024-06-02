import { ReactElement } from 'react';
import { Button, Stack, Text } from '@chakra-ui/react';

import { Modal } from '@/components/modal';
import { emptyFunction } from '@/utils/functionUtils';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirmAutoExclude: () => void | Promise<void>;
}

export const ConfirmAutoExclusion = ({
  isOpen,
  isLoading,
  onClose,
  onConfirmAutoExclude,
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
            onClick={onConfirmAutoExclude}
            variant="primary"
          >
            Auto Exclude
          </Button>
        </Stack>
      }
      isOpen={isOpen}
      onClose={isLoading ? emptyFunction : onClose}
      size="md"
      title="Are you sure you wish to perform auto exclusion?"
    >
      <Stack direction="column" spacing={4}>
        <Text>
          This will automatically exclude anyone who did not complete the
          window, and the appropriate reason will be assigned for that
          exclusion.
        </Text>
        <Text>
          Students excluded will also be auto unpaired for all future windows,
          including the current one you&apos;re viewing.
        </Text>
      </Stack>
    </Modal>
  );
};
