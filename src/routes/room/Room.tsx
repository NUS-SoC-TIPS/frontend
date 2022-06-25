import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Loading } from 'components/loading';
import { initSocketForCode } from 'lib/codeSocket';
import { initSocketForRoom } from 'lib/roomsSocket';
import { resetPanelState } from 'reducers/panelReducer';
import { resetRoomState, RoomJoiningStatus } from 'reducers/roomReducer';
import { useWindowDimensions } from 'utils/hookUtils';
import tokenUtils from 'utils/tokenUtils';

import { InAnotherRoom } from './errors/InAnotherRoom';
import { InAnotherTab } from './errors/InAnotherTab';
import { RoomDoesNotExist } from './errors/RoomDoesNotExist';
import { RoomIsClosed } from './errors/RoomIsClosed';
import { RoomIsFull } from './errors/RoomIsFull';
import { BottomBar } from './BottomBar';
import { Code } from './Code';
import { Panel } from './panel';
import { RoomPage } from './RoomPage';
import { Slider } from './Slider';
import { TopBar } from './topBar';
import { VideoCollection } from './video';

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
  const { status, partner, isPartnerInRoom } = useAppSelector(
    (state) => state.room,
  );
  const dispatch = useAppDispatch();
  const isTablet = useBreakpointValue({ base: false, md: true });
  const { width, height } = useWindowDimensions();
  const [editorSize, setEditorSize] = useState(0.5);

  useEffect(() => {
    let newSocket: Socket | null = null;
    if (token && params.slug) {
      dispatch(resetRoomState());
      dispatch(resetPanelState());
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

  if (!socket || status === RoomJoiningStatus.LOADING) {
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

  const isPanelCollapsed = editorSize >= 1;
  const fullLength = isTablet ? width : height - 96; // 48 (top) + 48 (bottom)
  const scaledLength = fullLength * editorSize - 16; // 16 is for the slider

  const onSliderDrag = (distance: number): void => {
    let ratio = Math.min(Math.max(distance / fullLength, 0.3), 1);
    if (ratio > 0.9) {
      ratio = 1;
    } else if (
      (!isPanelCollapsed && ratio >= 0.8) ||
      (isPanelCollapsed && ratio <= 0.9)
    ) {
      ratio = 0.8;
    }
    setEditorSize(ratio);
  };

  return (
    <RoomPage>
      <TopBar socket={socket} />
      <Box
        display="flex"
        flex={1}
        flexDirection={isTablet ? 'row' : 'column'}
        position="relative"
      >
        <Code
          height={isTablet ? '100%' : `${scaledLength}px`}
          socket={socket}
          width={isTablet ? `${scaledLength}px` : '100%'}
        />
        <Slider onDrag={onSliderDrag} />
        {!isPanelCollapsed && (
          <Panel
            height={isTablet ? height - 96 : height - 112 - scaledLength}
            socket={socket}
          />
        )}
        <VideoCollection
          isPartnerInRoom={isPartnerInRoom}
          partnerName={partner?.name}
        />
      </Box>
      <BottomBar socket={socket} />
    </RoomPage>
  );
};
