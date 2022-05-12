import { Socket } from 'socket.io-client';

import { store } from 'app/store';
import { CODE_EVENTS } from 'constants/events';
import { setDoc } from 'reducers/codeReducer';
import { Doc } from 'types/automerge';
import { Cursor } from 'types/cursor';
import {
  ChangeReaction,
  changeTextDoc,
  getChanges,
} from 'utils/automergeUtils';

let timeout: NodeJS.Timeout;

export const updateCode = (socket: Socket, doc: Doc, code: string): void => {
  const [newDoc, reaction] = changeTextDoc(doc, code);
  // eslint-disable-next-line no-console
  console.log(reaction);
  if (reaction === ChangeReaction.DO_NOT_PROCEED) {
    return;
  }
  const changes = getChanges(doc, newDoc);
  const action = (): void => {
    store.dispatch(setDoc(newDoc));
    socket.emit(CODE_EVENTS.UPDATE_CODE, changes);
  };
  if (reaction === ChangeReaction.SET_TIMEOUT) {
    timeout = setTimeout(action, 300);
  }
  if (reaction === ChangeReaction.CLEAR_TIMEOUT) {
    // eslint-disable-next-line no-console
    console.log(timeout);
    clearTimeout(timeout);
  }
  action();
};

export const updateCursor = (socket: Socket, cursor: Cursor): void => {
  socket.emit(CODE_EVENTS.UPDATE_CURSOR, cursor);
};
