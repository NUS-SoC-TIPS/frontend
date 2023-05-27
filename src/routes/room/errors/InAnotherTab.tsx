import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@chakra-ui/react';

import { Modal } from 'components/modal';
import { INTERVIEWS } from 'constants/routes';

import { RoomPage } from '../RoomPage';

export const InAnotherTab = (): ReactElement<typeof RoomPage> => {
  const navigate = useNavigate();
  return (
    <RoomPage>
      <Modal
        actions={
          <Stack direction="row" spacing={2}>
            <Button
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
          </Stack>
        }
        isOpen={true}
        onClose={(): void => undefined}
        title="You've already joined via another tab or window!"
      >
        Either continue via that tab/window, or close that session and refresh
        this page.
      </Modal>
    </RoomPage>
  );
};
