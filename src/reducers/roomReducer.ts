import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from 'types/models/user';

export enum RoomJoiningStatus {
  LOADING,
  SUCCESS,
  CLOSED,
  IN_ANOTHER_ROOM,
  IN_ANOTHER_TAB,
  ROOM_DOES_NOT_EXIST,
  FULL,
}

export interface RoomState {
  id: number;
  status: RoomJoiningStatus;
  partner: User | null;
  videoToken: string;
  notes: string;
  isPartnerInRoom: boolean; // the partner may be set, but they might have disconnected
  isRoomClosed: boolean; // this is for when the room was just closed by a user in the room
  userActualSlug: string; // only used if user is already in another room
  usersInRoom: User[]; // only used if room is full
}

const initialState: RoomState = {
  id: 0,
  status: RoomJoiningStatus.LOADING,
  partner: null,
  videoToken: '',
  notes: '',
  isPartnerInRoom: false,
  isRoomClosed: false,
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
        id,
        status,
        partner,
        videoToken,
        notes,
        isPartnerInRoom,
        isRoomClosed,
        userActualSlug,
        usersInRoom,
      } = action.payload;
      state.id = id ?? state.id;
      state.status = status ?? state.status;
      state.partner = partner ?? state.partner;
      state.videoToken = videoToken ?? state.videoToken;
      state.notes = notes ?? state.notes;
      state.isPartnerInRoom = isPartnerInRoom ?? state.isPartnerInRoom;
      state.isRoomClosed = isRoomClosed ?? state.isRoomClosed;
      state.userActualSlug = userActualSlug ?? state.userActualSlug;
      state.usersInRoom = usersInRoom ?? state.usersInRoom;
    },
    resetRoomState: (state: RoomState) => {
      state.id = 0;
      state.status = RoomJoiningStatus.LOADING;
      state.partner = null;
      state.videoToken = '';
      state.notes = '';
      state.isPartnerInRoom = false;
      state.isRoomClosed = false;
      state.userActualSlug = '';
      state.usersInRoom = [];
    },
  },
});

export const { updateRoomState, resetRoomState } = roomSlice.actions;

export default roomSlice.reducer;
