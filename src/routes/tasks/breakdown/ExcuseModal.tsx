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

interface Props {
  isOpen: boolean;
}

export const ExcuseModal = (
  props: Props,
): ReactElement<Props, typeof Modal> => {
  const { isOpen } = props;

  return (
    <Modal
      actions={
        <Stack direction="row" spacing={2}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </Stack>
      }
      isOpen={isOpen}
      title={'Submit Excuse (Jun 8 - Jun 15)'}
    >
      <Stack spacing={5}>
        <FormControl isRequired={true}>
          <FormLabel htmlFor="excuse-variant">Excuse From</FormLabel>
          <CheckboxGroup colorScheme="green" id="excuse-variant">
            <HStack spacing={10}>
              <Checkbox value="questions">Questions</Checkbox>
              <Checkbox value="interview">Interview</Checkbox>
            </HStack>
          </CheckboxGroup>
        </FormControl>

        <FormControl isRequired={true}>
          <FormLabel htmlFor="excuse-reason">Excuse Reason</FormLabel>
          <Textarea
            id="excuse-reason"
            placeholder="Enter your excuse reason here..."
          />
        </FormControl>
      </Stack>
    </Modal>
  );
};
