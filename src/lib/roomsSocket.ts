import { Socket } from 'socket.io-client';

import { store } from 'app/store';
import { AUTH_EVENTS, GENERAL_EVENTS, ROOM_EVENTS } from 'constants/events';
import {
  setExecutableLanguageToVersionMap,
  setLanguage,
} from 'reducers/codeReducer';
import { setNotes } from 'reducers/panelReducer';
import {
  RoomClosingStatus,
  RoomJoiningStatus,
  updateRoomState,
} from 'reducers/roomReducer';
import { UserBase } from 'types/api/users';
import { Language } from 'types/models/code';
import { User } from 'types/models/user';

export const closeRoom = (socket: Socket): void => {
  socket.emit(ROOM_EVENTS.CLOSE_ROOM);
};

const handleConnect = (socket: Socket, bearerToken: string): void => {
  socket.on(GENERAL_EVENTS.CONNECT, () => {
    socket.emit(AUTH_EVENTS.AUTHENTICATE, { bearerToken });
  });
};

const handleAuthenticate = (socket: Socket, slug: string): void => {
  socket.on(AUTH_EVENTS.AUTHENTICATE, () => {
    socket.emit(ROOM_EVENTS.JOIN_ROOM, { slug });
  });
};

const handleJoinRoom = (socket: Socket): void => {
  socket.on(
    ROOM_EVENTS.JOIN_ROOM,
    (data: {
      id: number;
      partner: { name: string } | null;
      videoToken: string;
      isPartnerInRoom: boolean;
      language: Language;
      notes: string;
      executableLanguageToVersionMap: { [language: string]: string };
    }) => {
      const {
        id,
        partner,
        videoToken,
        notes,
        language,
        isPartnerInRoom,
        executableLanguageToVersionMap,
      } = data;
      store.dispatch(
        updateRoomState({
          id,
          partner,
          videoToken,
          isPartnerInRoom,
          status: RoomJoiningStatus.SUCCESS,
        }),
      );
      store.dispatch(setNotes(notes));
      store.dispatch(setLanguage(language));
      store.dispatch(
        setExecutableLanguageToVersionMap(executableLanguageToVersionMap),
      );
    },
  );
};

const handleJoinRoomFailed = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.JOIN_ROOM_FAILED, () =>
    store.dispatch(updateRoomState({ status: RoomJoiningStatus.FAILED })),
  );
};

const handleRoomDoesNotExist = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.ROOM_DOES_NOT_EXIST, () =>
    store.dispatch(
      updateRoomState({ status: RoomJoiningStatus.ROOM_DOES_NOT_EXIST }),
    ),
  );
};

const handleAlreadyInRoom = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.ALREADY_IN_ROOM, (data: { slug: string }) =>
    store.dispatch(
      updateRoomState({
        status: RoomJoiningStatus.IN_ANOTHER_ROOM,
        userActualSlug: data.slug,
      }),
    ),
  );
};

const handleRoomIsClosed = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.ROOM_IS_CLOSED, () =>
    store.dispatch(updateRoomState({ status: RoomJoiningStatus.CLOSED })),
  );
};

const handleRoomIsFull = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.ROOM_IS_FULL, (data: { users: UserBase[] }) =>
    store.dispatch(
      updateRoomState({
        status: RoomJoiningStatus.FULL,
        usersInRoom: data.users,
      }),
    ),
  );
};

const handleInAnotherTab = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.IN_ANOTHER_TAB, () => {
    store.dispatch(
      updateRoomState({ status: RoomJoiningStatus.IN_ANOTHER_TAB }),
    );
  });
};

const handlePartnerJoinedRoom = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.JOINED_ROOM, (data: { partner: User }) => {
    store.dispatch(
      updateRoomState({ partner: data.partner, isPartnerInRoom: true }),
    );
  });
};

const handlePartnerDisconnected = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.PARTNER_DISCONNECTED, () => {
    store.dispatch(updateRoomState({ isPartnerInRoom: false }));
  });
};

const handleClosingRoom = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.CLOSING_ROOM, () => {
    store.dispatch(
      updateRoomState({
        closingStatus: RoomClosingStatus.CLOSING,
      }),
    );
  });
};

const handleCloseRoom = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.CLOSE_ROOM, () => {
    store.dispatch(
      updateRoomState({
        isRoomClosed: true,
        closingStatus: RoomClosingStatus.NOT_CLOSING,
      }),
    );
  });
};

const handleCloseRoomFailed = (socket: Socket): void => {
  socket.on(ROOM_EVENTS.CLOSE_ROOM_FAILED, () => {
    store.dispatch(
      updateRoomState({
        closingStatus: RoomClosingStatus.FAILED,
      }),
    );
  });
};

export const initSocketForRoom = (
  socket: Socket,
  token: string,
  slug: string,
): void => {
  handleConnect(socket, token);
  handleAuthenticate(socket, slug);
  handleJoinRoom(socket);
  handleRoomDoesNotExist(socket);
  handleJoinRoomFailed(socket);
  handleAlreadyInRoom(socket);
  handleInAnotherTab(socket);
  handleRoomIsClosed(socket);
  handleRoomIsFull(socket);
  handlePartnerJoinedRoom(socket);
  handlePartnerDisconnected(socket);
  handleClosingRoom(socket);
  handleCloseRoom(socket);
  handleCloseRoomFailed(socket);
};
