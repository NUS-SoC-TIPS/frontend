import { ReactElement } from 'react';
import { Button, Code, ListItem, OrderedList, Text } from '@chakra-ui/react';

import { Modal } from 'components/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({
  isOpen,
  onClose,
}: Props): ReactElement<Props, typeof Modal> => {
  return (
    <Modal
      actions={
        <Button onClick={onClose} variant="primary">
          I&apos;m ready!
        </Button>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title="Need help getting started with mock interviews?"
    >
      <Text mb={3}>Simply follow these steps:</Text>

      <OrderedList spacing={1}>
        <ListItem>
          <Text>
            Create a room by clicking the <Code>Create Room</Code> button.
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            Copy the invite link by clicking the <Code>Copy Invite</Code>{' '}
            button.
          </Text>
        </ListItem>
        <ListItem>
          <Text>Get your partner to join by sending them the link!</Text>
        </ListItem>
        <ListItem>
          <Text>
            Once you have completed the interview, click <Code>Close Room</Code>{' '}
            to end the session.
          </Text>
        </ListItem>
      </OrderedList>
      <Text color="muted" fontSize="sm" mt={4}>
        Note that your sessions need to be at least 15 minutes long to be
        counted. Your room will also auto-close after 5 minutes of inactivity.
      </Text>
    </Modal>
  );
};
