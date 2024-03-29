import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserBase } from 'types/api/users';

export enum RoomJoiningStatus {
  LOADING,
  SUCCESS,
  FAILED,
  CLOSED,
  IN_ANOTHER_ROOM,
  IN_ANOTHER_TAB,
  ROOM_DOES_NOT_EXIST,
  FULL,
}

export enum RoomClosingStatus {
  NOT_CLOSING,
  CLOSING,
  FAILED,
}

export interface RoomState {
  id: number;
  status: RoomJoiningStatus;
  partner: { name: string } | null;
  videoToken: string | null; // empty string = not set yet, null = video token failed to generate
  isPartnerInRoom: boolean; // the partner may be set, but they might have disconnected
  isRoomClosed: boolean; // this is for when the room was just closed by a user in the room
  userActualSlug: string; // only used if user is already in another room
  usersInRoom: UserBase[]; // only used if room is full
  closingStatus: RoomClosingStatus;
}

const initialState: RoomState = {
  id: 0,
  status: RoomJoiningStatus.LOADING,
  partner: null,
  videoToken: '',
  isPartnerInRoom: false,
  isRoomClosed: false,
  userActualSlug: '',
  usersInRoom: [],
  closingStatus: RoomClosingStatus.NOT_CLOSING,
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
        isPartnerInRoom,
        isRoomClosed,
        userActualSlug,
        usersInRoom,
        closingStatus,
      } = action.payload;
      state.id = id ?? state.id;
      state.status = status ?? state.status;
      state.partner = partner ?? state.partner;
      state.videoToken =
        videoToken !== undefined ? videoToken : state.videoToken;
      state.isPartnerInRoom = isPartnerInRoom ?? state.isPartnerInRoom;
      state.isRoomClosed = isRoomClosed ?? state.isRoomClosed;
      state.userActualSlug = userActualSlug ?? state.userActualSlug;
      state.usersInRoom = usersInRoom ?? state.usersInRoom;
      state.closingStatus = closingStatus ?? state.closingStatus;
    },
    resetRoomState: (state: RoomState) => {
      state.id = 0;
      state.status = RoomJoiningStatus.LOADING;
      state.partner = null;
      state.videoToken = '';
      state.isPartnerInRoom = false;
      state.isRoomClosed = false;
      state.userActualSlug = '';
      state.usersInRoom = [];
      state.closingStatus = RoomClosingStatus.NOT_CLOSING;
    },
  },
});

export const { updateRoomState, resetRoomState } = roomSlice.actions;

export default roomSlice.reducer;
