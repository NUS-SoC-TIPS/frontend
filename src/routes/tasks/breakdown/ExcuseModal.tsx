import { ReactElement, useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import { Modal } from '@/components/modal';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from '@/constants/toast';
import { createExcuse } from '@/lib/excuses';
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

  const [excuseFromVal, setExcuseFromVal] = useState<boolean[]>([]);
  const [excuseReasonVal, setExcuseReasonVal] = useState(excuse?.reason || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  useEffect(() => {
    setExcuseReasonVal(excuse?.reason || '');
  }, [excuse?.reason]);

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

  const handleSubmit = async (): Promise<void> => {
    const isBothChecked = excuseFromVal[0] && excuseFromVal[1];
    const excuseFrom = isBothChecked
      ? ExcuseFrom.INTERVIEW_AND_QUESTION
      : excuseFromVal[0]
      ? ExcuseFrom.QUESTION
      : ExcuseFrom.INTERVIEW;
    const reason = excuseReasonVal.trim();

    const data = {
      excuseFrom,
      reason,
      windowId: window.id,
    };

    try {
      setIsSubmitting(true);
      await createExcuse(data);
      toast({
        ...DEFAULT_TOAST_PROPS,
        title: 'Success!',
        status: 'success',
        description: 'Your excuse has been submitted successfully.',
      });
      handleClose();
    } catch (e) {
      toast(ERROR_TOAST_PROPS);
    } finally {
      setIsSubmitting(false);
    }

    return void 0;
  };

  return (
    <Modal
      actions={
        <Stack direction="row" spacing={2}>
          <Button onClick={handleClose} variant="secondary">
            {isEditable ? 'Cancel' : 'Close'}
          </Button>
          {isEditable && (
            <Button
              isLoading={isSubmitting}
              onClick={handleSubmit}
              variant="primary"
            >
              {excuse ? 'Modify' : 'Submit'}
            </Button>
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
              <Checkbox
                isChecked={excuseFromVal[0]}
                onChange={(e): void =>
                  setExcuseFromVal((p) => [e.target.checked, p[1]])
                }
                value="QUESTION"
              >
                Questions
              </Checkbox>
              <Checkbox
                isChecked={excuseFromVal[1]}
                isDisabled={!window.requireInterview}
                onChange={(e): void =>
                  setExcuseFromVal((p) => [p[0], e.target.checked])
                }
                value="INTERVIEW"
              >
                Interview
              </Checkbox>
            </HStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl isDisabled={!isEditable} isRequired={true}>
          <FormLabel htmlFor="excuse-reason">Excuse Reason</FormLabel>
          <Textarea
            id="excuse-reason"
            onChange={(e): void => setExcuseReasonVal(e.target.value)}
            placeholder="Enter your excuse reason here..."
            value={excuseReasonVal}
          />
        </FormControl>
      </Stack>
    </Modal>
  );
};
