import { ReactElement, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { ROOM } from 'constants/routes';
import { createRoom, getCurrentRoom } from 'lib/interviews';

interface State {
  isLoading: boolean;
  isError: boolean;
  roomSlug: string | null;
}

export const RoomButton = (): ReactElement<typeof Button> => {
  const [state, setState] = useReducer(
    (s: State, a: Partial<State>): State => ({ ...s, ...a }),
    {
      isLoading: true,
      isError: false,
      roomSlug: null,
    } as State,
  );
  const navigate = useNavigate();

  useEffect(() => {
    let didCancel = false;
    const fetchData = (): void => {
      getCurrentRoom()
        .then((roomSlug) => {
          if (!didCancel) {
            setState({ isLoading: false, roomSlug });
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
    if (state.roomSlug) {
      navigate(`${ROOM}/${state.roomSlug}`);
    } else {
      setState({ isLoading: true });
      const slug = await createRoom();
      navigate(`${ROOM}/${slug}`);
    }
  };

  return (
    <Button isLoading={state.isLoading} onClick={onClick} variant="primary">
      {state.roomSlug ? 'Rejoin Room' : 'Create Room'}
    </Button>
  );
};
