import { ReactElement } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Textarea,
} from '@chakra-ui/react';

import { Modal } from '@/components/modal';
import { ExcuseBase } from '@/types/api/excuses';
import { WindowBase } from '@/types/api/windows';
import { ExcuseFrom, ExcuseStatus } from '@/types/models/excuse';
import { formatDateWithoutYear } from '@/utils/dateUtils';

interface Props {
  isOpen: boolean;
  handleClose: () => void;
  window: WindowBase;
  excuses: ExcuseBase[];
}

export const ExcuseModal = (
  props: Props,
): ReactElement<Props, typeof Modal> => {
  const { isOpen, excuses, window, handleClose } = props;

  const excuse = excuses?.[0];
  const isEditable = !excuse || excuse.status === ExcuseStatus.PENDING;

  const mapExcuseFrom = (excuseFrom: ExcuseFrom): string[] => {
    switch (excuseFrom) {
      case ExcuseFrom.QUESTION:
        return ['QUESTION'];
      case ExcuseFrom.INTERVIEW:
        return ['INTERVIEW'];
      case ExcuseFrom.INTERVIEW_AND_QUESTION:
        return ['QUESTION', 'INTERVIEW'];
      default:
        return [];
    }
  };

  return (
    <Modal
      actions={
        <Stack direction="row" spacing={2}>
          <Button onClick={handleClose} variant="secondary">
            {isEditable ? 'Cancel' : 'Close'}
          </Button>
          {isEditable && (
            <Button variant="primary">{excuse ? 'Modify' : 'Submit'}</Button>
          )}
        </Stack>
      }
      isOpen={isOpen}
      title={`Submit Excuse (${formatDateWithoutYear(
        window.startAt,
      )} - ${formatDateWithoutYear(window.endAt)})`}
    >
      <Stack spacing={5}>
        <FormControl isDisabled={!isEditable} isRequired={true}>
          <FormLabel htmlFor="excuse-variant">Excuse From</FormLabel>
          <CheckboxGroup
            colorScheme="green"
            defaultValue={mapExcuseFrom(excuse?.excuseFrom)}
            id="excuse-variant"
          >
            <HStack spacing={10}>
              <Checkbox value="QUESTION">Questions</Checkbox>
              <Checkbox isDisabled={!window.requireInterview} value="INTERVIEW">
                Interview
              </Checkbox>
            </HStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl isDisabled={!isEditable} isRequired={true}>
          <FormLabel htmlFor="excuse-reason">Excuse Reason</FormLabel>
          <Textarea
            defaultValue={excuse?.excuseReason}
            id="excuse-reason"
            placeholder="Enter your excuse reason here..."
          />
        </FormControl>
      </Stack>
    </Modal>
  );
};
