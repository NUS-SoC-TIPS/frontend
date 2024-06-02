import { Socket } from 'socket.io-client';

import { store } from '@/app/store';
import { NOTES_EVENTS } from '@/constants/events';
import { setNotes } from '@/reducers/panelReducer';

export const updateNotes = (socket: Socket, notes: string): void => {
  store.dispatch(setNotes(notes));
  socket.emit(NOTES_EVENTS.UPDATE_NOTES, notes);
};
