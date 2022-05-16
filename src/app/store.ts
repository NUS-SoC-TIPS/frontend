import { configureStore } from '@reduxjs/toolkit';

import codeReducer from 'reducers/codeReducer';
import panelReducer from 'reducers/panelReducer';
import roomReducer from 'reducers/roomReducer';

export const store = configureStore({
  reducer: {
    room: roomReducer,
    code: codeReducer,
    panel: panelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ['code.doc.text'],
        ignoredActions: ['code/setDoc'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {room: RoomState, code: CodeState}
export type AppDispatch = typeof store.dispatch;
