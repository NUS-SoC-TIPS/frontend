import { ReactElement } from 'react';
import { Button, Stack, Text } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { emptyFunction } from 'utils/functionUtils';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirmRematchWindows: () => void | Promise<void>;
}

export const ConfirmRematchWindows = ({
  isOpen,
  isLoading,
  onClose,
  onConfirmRematchWindows,
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
            onClick={onConfirmRematchWindows}
            variant="primary"
          >
            Rematch Windows
          </Button>
        </Stack>
      }
      isOpen={isOpen}
      onClose={isLoading ? emptyFunction : onClose}
      size="md"
      title="Are you sure you wish to rematch windows?"
    >
      <Stack direction="column" spacing={4}>
        <Text>
          This operation will recompute the submissions and interviews done by
          all students for all windows, and rematch them to the appropriate
          window.
        </Text>
        <Text>
          Note that there is generally no need to do this unless a critical bug
          has occurred that is causing issues with the matching. This is an
          expensive operation overall and may lead to performance degradation
          momentarily.
        </Text>
      </Stack>
    </Modal>
  );
};
