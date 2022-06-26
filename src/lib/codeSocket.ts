import { Socket } from 'socket.io-client';

import { store } from 'app/store';
import { CODE_EVENTS } from 'constants/events';
import { setLanguage } from 'reducers/codeReducer';
import { Language } from 'types/models/code';

export const updateLanguage = (socket: Socket, language: Language): void => {
  store.dispatch(setLanguage(language));
  socket.emit(CODE_EVENTS.UPDATE_LANGUAGE, language);
};

const handleUpdateLanguage = (socket: Socket): void => {
  socket.on(CODE_EVENTS.UPDATE_LANGUAGE, (language: Language) => {
    store.dispatch(setLanguage(language));
  });
};

export const initSocketForCode = (socket: Socket): void => {
  handleUpdateLanguage(socket);
};
