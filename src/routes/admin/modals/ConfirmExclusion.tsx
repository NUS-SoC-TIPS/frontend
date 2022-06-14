import { ReactElement, useState } from 'react';
import { Button, FormControl, FormLabel } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { Select } from 'components/select';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  onConfirmExclude: (reason: string) => void | Promise<void>;
}

const reasons = [
  'Did not complete questions',
  'Did not complete interview',
  'Did not complete questions nor interview',
  'Did not submit resume',
  'Did not submit resume review',
  'Requested to drop out',
];

interface ReasonOption {
  label: string;
  value: string;
}

export const ConfirmExclusion = ({
  isOpen,
  onClose,
  name,
  onConfirmExclude,
}: Props): ReactElement<Props, typeof Modal> => {
  const [reason, setReason] = useState<string | null>(null);
  const options: ReasonOption[] = reasons.map((r) => ({ label: r, value: r }));

  const onChangeReason = (reason: unknown): void => {
    setReason(reason ? (reason as ReasonOption).value : null);
  };

  const handleExclude = (): void => {
    if (reason == null) {
      return;
    }
    onConfirmExclude(reason);
    setReason(null);
  };

  return (
    <Modal
      actions={
        <>
          <Button mr={2} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            isDisabled={reason == null || reason === ''}
            onClick={handleExclude}
            variant="primary"
          >
            Exclude
          </Button>
        </>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={`Exclude ${name}?`}
    >
      <FormControl isRequired={true}>
        <FormLabel htmlFor="reason">Reason for Exclusion</FormLabel>
        <Select
          onChange={onChangeReason}
          options={options}
          placeholder="Select reason..."
        />
      </FormControl>
    </Modal>
  );
};
