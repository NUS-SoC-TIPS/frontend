import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Loading } from 'components/loading';
import { initSocketForCode } from 'lib/codeSocket';
import { initSocketForRoom } from 'lib/roomsSocket';
import { resetCodeState } from 'reducers/codeReducer';
import { resetPanelState } from 'reducers/panelReducer';
import { resetRoomState, RoomJoiningStatus } from 'reducers/roomReducer';
import tokenUtils from 'utils/tokenUtils';

import { BottomBar } from './bottomBar/BottomBar';
import { InAnotherRoom } from './errors/InAnotherRoom';
import { InAnotherTab } from './errors/InAnotherTab';
import { RoomDoesNotExist } from './errors/RoomDoesNotExist';
import { RoomIsClosed } from './errors/RoomIsClosed';
import { RoomIsFull } from './errors/RoomIsFull';
import { MiddleSection } from './MiddleSection';
import { RoomPage } from './RoomPage';
import { TopBar } from './topBar';
import './Room.scss';

/**
 * The Room component contains stateful subcomponents. This is intentional, as the
 * room logic would be too complex otherwise.
 *
 * What this component mainly does is to establish the socket connection. The socket
 * is then passed into the individual subcomponents for them to handle the relevant
 * logic.
 *
 * Otherwise, the subcomponents would communicate with one another via the redux
 * store and state.
 */
export const Room = (): ReactElement => {
  const token = tokenUtils.getToken();
  const params = useParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { status } = useAppSelector((state) => state.room);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let newSocket: Socket | null = null;
    if (token && params.slug) {
      dispatch(resetRoomState());
      dispatch(resetPanelState());
      dispatch(resetCodeState());
      newSocket = io(`${process.env.REACT_APP_BACKEND_WS}`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
      });
      initSocketForRoom(newSocket, token, params.slug);
      initSocketForCode(newSocket);
      setSocket(newSocket);
    }
    return () => {
      newSocket?.disconnect();
      setSocket(null);
    };
  }, [token, params.slug, dispatch]);

  if (!socket || status === RoomJoiningStatus.LOADING || !params.slug) {
    return <Loading />;
  }
  if (status === RoomJoiningStatus.CLOSED) {
    return <RoomIsClosed />;
  }
  if (status === RoomJoiningStatus.IN_ANOTHER_ROOM) {
    return <InAnotherRoom />;
  }
  if (status === RoomJoiningStatus.IN_ANOTHER_TAB) {
    return <InAnotherTab />;
  }
  if (status === RoomJoiningStatus.ROOM_DOES_NOT_EXIST) {
    return <RoomDoesNotExist />;
  }
  if (status === RoomJoiningStatus.FULL) {
    return <RoomIsFull />;
  }

  return (
    <RoomPage>
      <TopBar socket={socket} />
      <MiddleSection slug={params.slug} socket={socket} />
      <BottomBar socket={socket} />
    </RoomPage>
  );
};
