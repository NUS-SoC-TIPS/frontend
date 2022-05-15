import { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Circle,
  Container,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from 'app/hooks';
import { Modal } from 'components/modal';
import { INTERVIEWS } from 'constants/routes';
import { useUser } from 'contexts/UserContext';
import { closeRoom } from 'lib/roomsSocket';
import { User } from 'types/models/user';

interface UserDisplayProps {
  user: User;
  color?: string;
}

const UserDisplay = ({
  user,
  color = 'white',
}: UserDisplayProps): ReactElement<UserDisplayProps, typeof HStack> => {
  return (
    <HStack spacing="2">
      <Circle bg={color} size="10px" />
      <Text fontSize="sm">{user.githubUsername}</Text>
    </HStack>
  );
};

interface Props {
  socket: Socket;
}

export const BottomBar = ({
  socket,
}: Props): ReactElement<Props, typeof Box> => {
  const [isCloseRoomModalOpen, setIsCloseRoomModalOpen] = useState(false);
  const [isClosingRoom, setIsClosingRoom] = useState(false);
  const user = useUser() as User;
  const { partner, isRoomClosed } = useAppSelector((state) => state.room);
  const navigate = useNavigate();

  const onCloseModal = (): void => {
    if (isRoomClosed) {
      navigate(INTERVIEWS);
      return;
    }
    if (isClosingRoom) {
      return;
    }
    setIsCloseRoomModalOpen(false);
  };

  const onCloseRoom = (): void => {
    setIsClosingRoom(true);
    closeRoom(socket);
  };

  return (
    <Box
      as="footer"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxWidth="100%" px={2} py={2}>
        <HStack justify="space-between" spacing="10">
          <HStack spacing="4">
            <Button size="sm" variant="secondary">
              Execute Code
            </Button>
            <UserDisplay user={user} />
            {partner && <UserDisplay color="green" user={partner} />}
          </HStack>
          <Button
            colorScheme="red"
            onClick={(): void => setIsCloseRoomModalOpen(true)}
            size="sm"
          >
            Close Room
          </Button>
        </HStack>
      </Container>
      <Modal
        actions={
          isRoomClosed ? (
            <Button
              onClick={(): void => navigate(INTERVIEWS)}
              variant="primary"
            >
              Back to Home
            </Button>
          ) : (
            <>
              <Button
                disabled={isClosingRoom}
                mr={2}
                onClick={onCloseModal}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button
                isLoading={isClosingRoom}
                onClick={onCloseRoom}
                variant="primary"
              >
                Close Room
              </Button>
            </>
          )
        }
        isOpen={isCloseRoomModalOpen || isRoomClosed}
        onClose={onCloseModal}
        title={
          isRoomClosed
            ? 'The room has been closed.'
            : 'Are you sure you wish to close the room?'
        }
      >
        {isRoomClosed
          ? 'Thank you for practicing using TIPS. You can see a record of this session back at the home page.'
          : 'The room will be closed and this session will end for all participants.'}
      </Modal>
    </Box>
  );
};
