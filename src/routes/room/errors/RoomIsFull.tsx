import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Text } from '@chakra-ui/react';

import { useAppSelector } from 'app/hooks';
import { Modal } from 'components/modal';
import { UserProfile } from 'components/userProfile';
import { INTERVIEWS } from 'constants/routes';
import { User } from 'types/models/user';

import { RoomPage } from '../RoomPage';

interface UserButtonProps {
  user: User;
}

const UserButton = ({
  user,
}: UserButtonProps): ReactElement<UserButtonProps, typeof Button> => {
  return (
    <Button cursor="default" justifyContent="start" px={1} py={8} w={'100%'}>
      <UserProfile user={user} />
    </Button>
  );
};

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
          <UserButton user={usersInRoom[0]} />
          <UserButton user={usersInRoom[1]} />
        </Stack>
      </Modal>
    </RoomPage>
  );
};
