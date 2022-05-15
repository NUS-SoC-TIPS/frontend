import { ReactElement } from 'react';
import { Socket } from 'socket.io-client';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import CodeEditor from 'components/codeEditor/CodeEditor';
import { updateCode, updateCursor } from 'lib/codeSocket';
import { clearNext, setPosition } from 'reducers/codeReducer';
import { ChangeEvent } from 'types/automerge/ace';
import { Cursor, Position } from 'types/cursor';

interface Props {
  socket: Socket;
}

export const Code = ({
  socket,
}: Props): ReactElement<Props, typeof CodeEditor> => {
  const {
    cursor: { hasNext, nextCursor, currentCursor },
    doc,
    partnerCursor,
    language,
  } = useAppSelector((state) => state.code);
  const { partner, isPartnerInRoom } = useAppSelector((state) => state.room);
  const dispatch = useAppDispatch();

  return (
    <CodeEditor
      clearNextPosition={(): void => {
        dispatch(clearNext());
      }}
      hasNextPosition={hasNext}
      height="100%"
      language={language}
      nextPosition={nextCursor}
      onChange={(code: ChangeEvent): void => updateCode(socket, code)}
      onCursorChange={(cursor: Cursor): void => updateCursor(socket, cursor)}
      partnerCursor={partner && isPartnerInRoom ? partnerCursor : undefined}
      position={currentCursor}
      setPosition={(position: Position): void => {
        dispatch(setPosition(position));
      }}
      value={doc.text.toString()}
      width="100%"
    />
  );
};