import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';

import { useAppDispatch } from 'app/hooks';
import { initSocketForRoom } from 'lib/roomsSocket';
import { resetRoomState } from 'reducers/roomReducer';
import tokenUtils from 'utils/tokenUtils';

import { TopBar } from './TopBar';

export const Room = (): ReactElement => {
  const params = useParams();
  const token = tokenUtils.getToken();
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let newSocket: Socket | null = null;
    if (token && params.slug) {
      dispatch(resetRoomState());
      newSocket = io(`${process.env.REACT_APP_BACKEND_WS}`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      });
      initSocketForRoom(newSocket, token, params.slug);
      setSocket(newSocket);
    }
    return () => {
      newSocket?.disconnect();
      setSocket(null);
    };
  }, [token, params.slug, dispatch]);

  // eslint-disable-next-line no-console
  console.log(socket);

  return (
    <Box as="section" height="100vh" width="100vw">
      <TopBar slug={params.slug as string} />
    </Box>
  );
};
