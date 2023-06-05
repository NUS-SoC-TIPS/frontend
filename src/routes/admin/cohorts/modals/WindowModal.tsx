import { ReactElement, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
} from '@chakra-ui/react';

import { Datepicker } from 'components/datepicker';
import { Modal } from 'components/modal';
import { RadioButton, RadioButtonGroup } from 'components/radio';
import {
  formatDateWithYear,
  isBeforeByDate,
  isSameByDate,
} from 'utils/dateUtils';
import { emptyFunction } from 'utils/functionUtils';

interface Props {
  isOpen: boolean;
  isCreate: boolean;
  isLoading: boolean;
  startAt: Date;
  endAt: Date;
  numQuestions: number;
  requireInterview: boolean;
  onClose: () => void;
  onSave: (
    startAt: Date,
    endAt: Date,
    numQuestions: number,
    requireInterview: boolean,
  ) => void;
  otherWindows: { startAt: Date; endAt: Date }[];
}

export const WindowModal = ({
  isOpen,
  isCreate,
  isLoading,
  startAt,
  endAt,
  numQuestions,
  requireInterview,
  onClose,
  onSave,
  otherWindows,
}: Props): ReactElement<Props, typeof Modal> => {
  const [newStartAt, setNewStartAt] = useState(startAt);
  const [newEndAt, setNewEndAt] = useState(endAt);
  const [newNumQuestions, setNewNumQuestions] = useState(numQuestions);
  const [newRequireInterview, setNewRequireInterview] =
    useState(requireInterview);

  useEffect(() => {
    setNewStartAt(startAt);
  }, [startAt]);

  useEffect(() => {
    setNewEndAt(endAt);
  }, [endAt]);

  useEffect(() => {
    setNewNumQuestions(numQuestions);
  }, [numQuestions]);

  useEffect(() => {
    setNewRequireInterview(requireInterview);
  }, [requireInterview]);

  const isNumQuestionValid =
    !Number.isNaN(newNumQuestions) &&
    newNumQuestions > 0 &&
    newNumQuestions <= 10;

  const isTimeframeValid = otherWindows.every(({ startAt, endAt }) => {
    return (
      (isBeforeByDate(newStartAt.toDateString(), startAt) &&
        isBeforeByDate(newEndAt.toDateString(), startAt)) ||
      (isBeforeByDate(endAt, newStartAt.toDateString()) &&
        isBeforeByDate(endAt, newEndAt.toDateString()))
    );
  });

  const getErrorMessage = (): string | null => {
    if (!isNumQuestionValid) {
      return 'Number of questions should between 1 to 10.';
    }
    if (!isTimeframeValid) {
      return 'This window overlaps with existing windows.';
    }
    return null;
  };

  const allValuesAreEqual = (): boolean => {
    return (
      !isCreate &&
      numQuestions === newNumQuestions &&
      requireInterview === newRequireInterview &&
      isSameByDate(
        newStartAt.toDateString(),
        formatDateWithYear(startAt, false),
      ) &&
      isSameByDate(newEndAt.toDateString(), formatDateWithYear(endAt, false))
    );
  };

  const handleSave = (): void => {
    onSave(newStartAt, newEndAt, newNumQuestions, newRequireInterview);
  };

  const errorMessage = getErrorMessage();

  return (
    <Modal
      actions={
        <Stack direction="row" spacing={2}>
          <Button isDisabled={isLoading} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            isDisabled={errorMessage != null || allValuesAreEqual()}
            isLoading={isLoading}
            onClick={handleSave}
            variant="primary"
          >
            {isCreate ? 'Add' : 'Update'}
          </Button>
        </Stack>
      }
      isOpen={isOpen}
      onClose={isLoading ? emptyFunction : onClose}
      size="md"
      title={isCreate ? 'Create Window' : 'Update Window'}
    >
      <Stack spacing={4}>
        <FormControl isRequired={true}>
          <FormLabel htmlFor="start-at">Start At (00:00 SGT)</FormLabel>
          <Datepicker
            date={newStartAt}
            id="start-at"
            name="start-at"
            onDateChange={setNewStartAt}
          />
        </FormControl>
        <FormControl isRequired={true}>
          <FormLabel htmlFor="end-at">End At (23:59 SGT)</FormLabel>
          <Datepicker
            date={newEndAt}
            id="end-at"
            name="end-at"
            onDateChange={setNewEndAt}
          />
        </FormControl>
        <FormControl isRequired={true}>
          <FormLabel htmlFor="num-questions">Number of Questions</FormLabel>
          <NumberInput
            id="num-questions"
            max={10}
            min={1}
            name="num-questions"
            onChange={(_, valueAsNumber): void =>
              setNewNumQuestions(valueAsNumber)
            }
            value={!Number.isNaN(newNumQuestions) ? newNumQuestions : ''}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl isRequired={true}>
          <FormLabel htmlFor="require-interview">Require Interview?</FormLabel>
          <RadioButtonGroup
            onChange={(value: 'true' | 'false'): void =>
              setNewRequireInterview(value === 'true')
            }
            size="md"
            value={`${newRequireInterview}`}
            w="100%"
          >
            <RadioButton value="true">Required</RadioButton>
            <RadioButton value="false">Not Required</RadioButton>
          </RadioButtonGroup>
        </FormControl>
        {errorMessage && (
          <Box
            bg="red.600"
            borderRadius="xl"
            px={{ base: 4, md: 3 }}
            py={{ base: 4, md: 2.5 }}
          >
            <Text color="on-accent-muted">{errorMessage}</Text>
          </Box>
        )}
      </Stack>
    </Modal>
  );
};
