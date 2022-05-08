import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from 'types/models/user';

export enum RoomJoiningStatus {
  LOADING,
  SUCCESS,
  CLOSED,
  IN_ANOTHER_ROOM,
  ROOM_DOES_NOT_EXIST,
  FULL,
}

export interface RoomState {
  status: RoomJoiningStatus;
  partner: User | null;
  videoToken: string;
  notes: string;
  userActualSlug: string; // only used if user is already in another room
  usersInRoom: User[]; // only used if room is full
}

const initialState: RoomState = {
  status: RoomJoiningStatus.LOADING,
  partner: null,
  videoToken: '',
  notes: '',
  userActualSlug: '',
  usersInRoom: [],
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    updateRoomState: (
      state: RoomState,
      action: PayloadAction<Partial<RoomState>>,
    ) => {
      const {
        status,
        partner,
        videoToken,
        notes,
        userActualSlug,
        usersInRoom,
      } = action.payload;
      state.status = status ?? state.status;
      state.partner = partner ?? state.partner;
      state.videoToken = videoToken ?? state.videoToken;
      state.notes = notes ?? state.notes;
      state.userActualSlug = userActualSlug ?? state.userActualSlug;
      state.usersInRoom = usersInRoom ?? state.usersInRoom;
    },
    resetRoomState: (state: RoomState) => {
      state.status = RoomJoiningStatus.LOADING;
      state.partner = null;
      state.videoToken = '';
      state.notes = '';
      state.userActualSlug = '';
      state.usersInRoom = [];
    },
  },
});

export const { updateRoomState, resetRoomState } = roomSlice.actions;

export default roomSlice.reducer;
