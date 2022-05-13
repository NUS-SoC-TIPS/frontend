import { Socket } from 'socket.io-client';

import { store } from 'app/store';
import { CODE_EVENTS } from 'constants/events';
import { setDoc } from 'reducers/codeReducer';
import { ChangeEvent } from 'types/automerge/ace';
import { Cursor } from 'types/cursor';
import { changeTextDoc, getChanges } from 'utils/automergeUtils';

export const updateCode = (socket: Socket, code: ChangeEvent): void => {
  const doc = store.getState().code.doc;
  const newDoc = changeTextDoc(doc, code);
  const changes = getChanges(doc, newDoc);
  store.dispatch(setDoc(newDoc));
  socket.emit(CODE_EVENTS.UPDATE_CODE, changes);
};

export const updateCursor = (socket: Socket, cursor: Cursor): void => {
  socket.emit(CODE_EVENTS.UPDATE_CURSOR, cursor);
};
