import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Modal } from '@/components/modal';
import { INTERVIEWS } from '@/constants/routes';

import { RoomPage } from '../RoomPage';

export const RoomDoesNotExist = (): ReactElement<typeof RoomPage> => {
  const navigate = useNavigate();
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
        title="This room does not exist!"
      >
        Do create a new room back at the home page to get started with
        practicing!
      </Modal>
    </RoomPage>
  );
};
