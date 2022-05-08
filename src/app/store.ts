import { configureStore } from '@reduxjs/toolkit';

import codeReducer from 'reducers/codeReducer';
import roomReducer from 'reducers/roomReducer';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    code: codeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {room: RoomState, code: CodeState}
export type AppDispatch = typeof store.dispatch;
