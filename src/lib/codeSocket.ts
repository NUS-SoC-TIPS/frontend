import { Socket } from 'socket.io-client';

import { store } from 'app/store';
import { CODE_EVENTS } from 'constants/events';
import {
  applyChanges,
  setDoc,
  setLanguage,
  setPartnerCursor,
} from 'reducers/codeReducer';
import { ChangeEvent } from 'types/automerge/ace';
import { Cursor } from 'types/cursor';
import { Language } from 'types/models/code';
import { changeTextDoc, getChanges } from 'utils/automergeUtils';

export const updateCode = (socket: Socket, change: ChangeEvent): void => {
  const doc = store.getState().code.doc;
  const newDoc = changeTextDoc(doc, change);
  const changes = getChanges(doc, newDoc);
  store.dispatch(setDoc(newDoc));
  socket.emit(CODE_EVENTS.UPDATE_CODE, changes);
};

export const updateLanguage = (socket: Socket, language: Language): void => {
  store.dispatch(setLanguage(language));
  socket.emit(CODE_EVENTS.UPDATE_LANGUAGE, language);
};

export const updateCursor = (socket: Socket, cursor: Cursor): void => {
  socket.emit(CODE_EVENTS.UPDATE_CURSOR, cursor);
};

const handleUpdateCode = (socket: Socket): void => {
  socket.on(CODE_EVENTS.UPDATE_CODE, (data: string[]) => {
    store.dispatch(applyChanges(data));
  });
};

const handleUpdateLanguage = (socket: Socket): void => {
  socket.on(CODE_EVENTS.UPDATE_LANGUAGE, (language: Language) => {
    store.dispatch(setLanguage(language));
  });
};

const handleUpdateCursor = (socket: Socket): void => {
  socket.on(CODE_EVENTS.UPDATE_CURSOR, (partnerCursor: Cursor) => {
    store.dispatch(setPartnerCursor(partnerCursor));
  });
};

export const initSocketForCode = (socket: Socket): void => {
  handleUpdateCode(socket);
  handleUpdateLanguage(socket);
  handleUpdateCursor(socket);
};
