import { ReactElement, ReactNode, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Circle,
  Container,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from 'app/hooks';
import {
  CURSOR_COLOR_TO_SEND_PARTNER,
  OWN_CURSOR_COLOR,
} from 'components/codeEditor/colors';
import { Modal } from 'components/modal';
import { INTERVIEWS } from 'constants/routes';
import { ERROR_TOAST_PROPS } from 'constants/toast';
import { useUser } from 'contexts/UserContext';
import { closeRoom } from 'lib/roomsSocket';
import { RoomClosingStatus } from 'reducers/roomReducer';
import { UserSelf } from 'types/api/users';

import { CodeExecutionButton } from './CodeExecutionButton';

interface UserDisplayProps {
  user: { name: string };
  color?: string;
  isDisconnected?: boolean;
}

const UserDisplay = ({
  user,
  color = OWN_CURSOR_COLOR,
  isDisconnected = false,
}: UserDisplayProps): ReactElement<UserDisplayProps, typeof HStack> => {
  return (
    <HStack opacity={isDisconnected ? 0.5 : undefined} spacing={2}>
      <Circle bg={color} size="10px" />
      <Text fontSize="sm">
        {user.name}
        {isDisconnected ? ' (Disconnected)' : ''}
      </Text>
    </HStack>
  );
};

interface Props {
  socket: Socket;
}

export const BottomBar = ({
  socket,
}: Props): ReactElement<Props, typeof Box> => {
  const isDesktop = useBreakpointValue(
    { base: false, lg: true },
    { ssr: false },
  );
  const [isCloseRoomModalOpen, setIsCloseRoomModalOpen] = useState(false);
  const user = useUser() as UserSelf;
  const { partner, isRoomClosed, isPartnerInRoom, closingStatus } =
    useAppSelector((state) => state.room);
  const toast = useToast();
  const [isClosingRoom, setIsClosingRoom] = useState(false); // Used to identify who is the one closing the room

  useEffect(() => {
    if (closingStatus === RoomClosingStatus.FAILED && isClosingRoom) {
      toast({ ...ERROR_TOAST_PROPS, title: 'Failed to close room!' });
      setIsClosingRoom(false);
    }
  }, [closingStatus, toast, isClosingRoom]);

  const onCloseModal = (): void => {
    if (isRoomClosed || closingStatus === RoomClosingStatus.CLOSING) {
      return;
    }
    setIsCloseRoomModalOpen(false);
  };

  const onCloseRoom = (): void => {
    if (isRoomClosed || closingStatus === RoomClosingStatus.CLOSING) {
      return;
    }
    setIsClosingRoom(true);
    closeRoom(socket);
  };

  const getModalActions = (): ReactNode => {
    if (isRoomClosed) {
      return (
        <Button
          onClick={async (): Promise<void> =>
            navigator.mediaDevices
              .getUserMedia({
                audio: true,
                video: true,
              })
              .then((stream) => {
                stream.getTracks().forEach((track) => {
                  track.stop();
                });
                window.location.href = INTERVIEWS;
              })
          }
          variant="primary"
        >
          Back to Home
        </Button>
      );
    }

    return (
      <>
        <Button
          isDisabled={closingStatus === RoomClosingStatus.CLOSING}
          mr={2}
          onClick={onCloseModal}
          variant="secondary"
        >
          Cancel
        </Button>
        <Button
          isLoading={closingStatus === RoomClosingStatus.CLOSING}
          onClick={onCloseRoom}
          variant="primary"
        >
          Close Room
        </Button>
      </>
    );
  };

  const getModalTitle = (): string => {
    if (isRoomClosed) {
      return 'The room has been closed.';
    }
    return 'Are you sure you wish to close the room?';
  };

  const getModalBody = (): string => {
    if (isRoomClosed) {
      return 'Thank you for practicing using TIPS. You can see a record of this session back at the home page.';
    }
    return 'The room will be closed and this session will end for all participants.';
  };

  return (
    <Box
      as="footer"
      bg="bg-surface"
      boxShadow={useColorModeValue('sm', 'sm-dark')}
    >
      <Container maxWidth="100%" px={2} py={2}>
        <HStack justify="space-between" spacing={10}>
          <HStack spacing={4}>
            <CodeExecutionButton socket={socket} />
            {isDesktop && (
              <>
                <UserDisplay user={user} />
                {partner && (
                  <UserDisplay
                    color={CURSOR_COLOR_TO_SEND_PARTNER.color}
                    isDisconnected={!isPartnerInRoom}
                    user={partner}
                  />
                )}
              </>
            )}
          </HStack>
          <Button
            colorScheme="red"
            isDisabled={closingStatus === RoomClosingStatus.CLOSING}
            onClick={(): void => setIsCloseRoomModalOpen(true)}
            size="sm"
          >
            Close Room
          </Button>
        </HStack>
      </Container>
      <Modal
        actions={getModalActions()}
        isOpen={isCloseRoomModalOpen || isRoomClosed}
        onClose={onCloseModal}
        title={getModalTitle()}
      >
        {getModalBody()}
      </Modal>
    </Box>
  );
};
