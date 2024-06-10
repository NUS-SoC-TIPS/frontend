import React, { ReactElement, useRef, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import { Modal } from '@/components/modal';
import { DEFAULT_TOAST_PROPS, ERROR_TOAST_PROPS } from '@/constants/toast';
import { createExcuse, deleteExcuse, updateExcuse } from '@/lib/excuses';
import { ExcuseBase } from '@/types/api/excuses';
import { WindowBase } from '@/types/api/windows';
import { ExcuseFrom, ExcuseStatus } from '@/types/models/excuse';
import { formatDateWithoutYear } from '@/utils/dateUtils';

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

  const modalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();

  const handleDelete = async (): Promise<void> => {
    if (!excuse) {
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteExcuse(excuse.id);
      toast({
        ...DEFAULT_TOAST_PROPS,
        title: 'Success!',
        status: 'success',
        description: 'Your excuse has been deleted successfully.',
      });
      handleClose();
    } catch (e) {
      toast(ERROR_TOAST_PROPS);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (): void => {
    formRef.current?.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true }),
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    const excuseFromQuestion = (
      e.currentTarget.elements.namedItem('excuseQuestion') as HTMLInputElement
    )?.checked;
    const excuseFromInterview = (
      e.currentTarget.elements.namedItem('excuseInterview') as HTMLInputElement
    )?.checked;
    const reason = (
      e.currentTarget.elements.namedItem('reason') as HTMLInputElement
    )?.value;

    const isNoneChecked = !excuseFromQuestion && !excuseFromInterview;
    const isEmptyReason = !reason;
    if (isNoneChecked || isEmptyReason) {
      toast({
        ...DEFAULT_TOAST_PROPS,
        title: 'Error!',
        status: 'error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const isBothChecked = excuseFromQuestion && excuseFromInterview;
    const excuseFrom = isBothChecked
      ? ExcuseFrom.INTERVIEW_AND_QUESTION
      : excuseFromQuestion
      ? ExcuseFrom.QUESTION
      : ExcuseFrom.INTERVIEW;

    const data = {
      excuseFrom,
      reason,
      windowId: window.id,
    };

    try {
      setIsSubmitting(true);
      if (excuse) {
        await updateExcuse(excuse.id, data);
      } else {
        await createExcuse(data);
      }
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
  };

  return (
    <Modal
      actions={
        <Stack direction="row" spacing={2}>
          <Button onClick={handleClose} variant="secondary">
            {isEditable ? 'Cancel' : 'Close'}
          </Button>
          {isEditable && excuse && (
            <Popover>
              <PopoverTrigger>
                <Button
                  colorScheme="red"
                  isLoading={isSubmitting}
                  variant="primary"
                >
                  Delete
                </Button>
              </PopoverTrigger>
              <Portal containerRef={modalRef}>
                <PopoverContent>
                  <PopoverHeader>Delete Excuse</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    Are you sure you want to delete this excuse?
                  </PopoverBody>
                  <PopoverFooter display="flex" justifyContent="flex-end">
                    <ButtonGroup size="sm">
                      <Button colorScheme="red" onClick={handleDelete}>
                        Apply
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </Portal>
            </Popover>
          )}
          {isEditable && (
            <Button
              isLoading={isSubmitting}
              onClick={handleFormSubmit}
              variant="primary"
            >
              {excuse ? 'Modify' : 'Submit'}
            </Button>
          )}
        </Stack>
      }
      isOpen={isOpen}
      onClose={handleClose}
      ref={modalRef}
      title={`Submit Excuse (${formatDateWithoutYear(
        window.startAt,
      )} - ${formatDateWithoutYear(window.endAt)})`}
    >
      <form onSubmit={handleSubmit} ref={formRef}>
        <Stack spacing={5}>
          <FormControl isDisabled={!isEditable} isRequired={true}>
            <FormLabel htmlFor="excuse-variant">Excuse From</FormLabel>
            <CheckboxGroup
              colorScheme="green"
              defaultValue={mapExcuseFrom(excuse?.excuseFrom)}
            >
              <HStack spacing={10}>
                <Checkbox name="excuseQuestion" value="QUESTION">
                  Questions
                </Checkbox>
                <Checkbox
                  isDisabled={!window.requireInterview}
                  name="excuseInterview"
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
              defaultValue={excuse?.reason}
              id="excuse-reason"
              name="reason"
              placeholder="Enter your excuse reason here..."
            />
          </FormControl>
        </Stack>
      </form>
    </Modal>
  );
};
