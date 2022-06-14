import { ReactElement } from 'react';
import { Button, Text } from '@chakra-ui/react';

import { Modal } from 'components/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  onConfirmInclude: () => void | Promise<void>;
}

export const ConfirmInclusion = ({
  isOpen,
  onClose,
  name,
  onConfirmInclude,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      actions={
        <>
          <Button mr={2} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirmInclude} variant="primary">
            Include
          </Button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      title={`Include ${name}?`}
    >
      <Text>Are you sure you wish to include {name}?</Text>
    </Modal>
  );
};
