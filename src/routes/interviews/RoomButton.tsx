import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { ROOM } from 'constants/routes';
import { createRoom, getCurrentRoom } from 'lib/rooms';
import { Room } from 'types/models/room';

interface State {
  isLoading: boolean;
  isError: boolean;
  room: Room | null;
}

export const RoomButton = (): ReactElement<typeof Button> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      room: null,
    } as State,
  );
  const navigate = useNavigate();

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): void => {
      getCurrentRoom()
        .then((room: Room | null) => {
          if (!didCancel) {
            setState({ isLoading: false, room });
          }
        })
        .catch(() => {
          if (!didCancel) {
            setState({ isLoading: false, isError: true });
          }
        });
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, []);

  const onClick = async (): Promise<void> => {
    if (state.room) {
      navigate(`${ROOM}/${state.room.slug}`);
    } else {
      setState({ isLoading: true });
      const slug = await createRoom();
      navigate(`${ROOM}/${slug}`);
    }
  };

  return (
    <Button isLoading={state.isLoading} onClick={onClick} variant="primary">
      {state.room ? 'Rejoin Room' : 'Create Room'}
    </Button>
  );
};
