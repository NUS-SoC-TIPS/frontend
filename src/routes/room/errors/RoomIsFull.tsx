import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Text } from '@chakra-ui/react';

import { useAppSelector } from '@/app/hooks';
import { Modal } from '@/components/modal';
import { UserProfileHighlight } from '@/components/userProfile';
import { INTERVIEWS } from '@/constants/routes';

import { RoomPage } from '../RoomPage';

export const RoomIsFull = (): ReactElement<typeof RoomPage> => {
  const navigate = useNavigate();
  const { usersInRoom } = useAppSelector((state) => state.room);

  return (
    <RoomPage>
      <Modal
        actions={
          <Button onClick={(): void => navigate(INTERVIEWS)} variant="primary">
            Back to Home
          </Button>
        }
        isOpen={true}
        onClose={(): void => undefined}
        title="This room is already full!"
      >
        <Stack direction="column" spacing={2}>
          <Text>There are already two users in this room:</Text>
          <UserProfileHighlight user={usersInRoom[0]} />
          <UserProfileHighlight user={usersInRoom[1]} />
        </Stack>
      </Modal>
    </RoomPage>
  );
};
