import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { useAppSelector } from '@/app/hooks';
import { Modal } from '@/components/modal';
import { ROOM } from '@/constants/routes';

import { RoomPage } from '../RoomPage';

export const InAnotherRoom = (): ReactElement<typeof RoomPage> => {
  const navigate = useNavigate();
  const { userActualSlug } = useAppSelector((state) => state.room);

  return (
    <RoomPage>
      <Modal
        actions={
          <Button
            onClick={(): void => navigate(`${ROOM}/${userActualSlug}`)}
            variant="primary"
          >
            Resume Your Room
          </Button>
        }
        isOpen={true}
        onClose={(): void => undefined}
        title="You are already in a room!"
      >
        You can only join one room at a time. You will need to complete your
        practice in your current room before you can start a new session.
      </Modal>
    </RoomPage>
  );
};
