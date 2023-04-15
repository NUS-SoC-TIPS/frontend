import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { INTERVIEWS } from 'constants/routes';

import { RoomPage } from '../RoomPage';

export const FailedToJoinRoom = (): ReactElement<typeof RoomPage> => {
  const navigate = useNavigate();
  return (
    <RoomPage>
      <Modal
        actions={
          <>
            <Button
              mr={2}
              onClick={(): void => window.location.reload()}
              variant="secondary"
            >
              Refresh
            </Button>
            <Button
              onClick={(): void => navigate(INTERVIEWS)}
              variant="primary"
            >
              Back to Home
            </Button>
          </>
        }
        isOpen={true}
        onClose={(): void => undefined}
        title="Failed to join room!"
      >
        Something went wrong along the way. Please refresh this page to try
        again.
      </Modal>
    </RoomPage>
  );
};