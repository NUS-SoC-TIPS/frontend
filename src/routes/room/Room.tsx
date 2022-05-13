import { ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import CodeEditor from 'components/codeEditor/CodeEditor';
import { Loading } from 'components/loading';
import { useUser } from 'contexts/UserContext';
import { updateCode, updateCursor } from 'lib/codeSocket';
import { initSocketForRoom } from 'lib/roomsSocket';
import { clearNext, setPosition } from 'reducers/codeReducer';
import { resetRoomState, RoomJoiningStatus } from 'reducers/roomReducer';
import { ChangeEvent } from 'types/automerge/ace';
import { Cursor, Position } from 'types/cursor';
import tokenUtils from 'utils/tokenUtils';

import { BottomBar } from './BottomBar';
import { TopBar } from './TopBar';

export const Room = (): ReactElement => {
  const params = useParams();
  const token = tokenUtils.getToken();
  const user = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const { cursor, doc, partnerCursor, language } = useAppSelector(
    (state) => state.code,
  );
  const { status, partner, isPartnerInRoom } = useAppSelector(
    (state) => state.room,
  );
  const { hasNext, nextCursor, currentCursor } = cursor;
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

  if (!socket || !user || status === RoomJoiningStatus.LOADING) {
    return <Loading />;
  }

  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100vw"
    >
      <TopBar language={language} slug={params.slug as string} />
      <Box flex={1}>
        <CodeEditor
          clearNextPosition={(): void => {
            dispatch(clearNext());
          }}
          hasNextPosition={hasNext}
          height="100%"
          language={language}
          nextPosition={nextCursor}
          onChange={(code: ChangeEvent): void => updateCode(socket, code)}
          onCursorChange={(cursor: Cursor): void =>
            updateCursor(socket, cursor)
          }
          partnerCursor={partner && isPartnerInRoom ? partnerCursor : undefined}
          position={currentCursor}
          setPosition={(position: Position): void => {
            dispatch(setPosition(position));
          }}
          value={doc.text.toString()}
          width="100%"
        />
      </Box>
      <BottomBar partner={partner} user={user} />
    </Box>
  );
};
