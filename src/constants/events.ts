export const GENERAL_EVENTS = {
  CONNECT: 'connect',
};

export const AUTH_EVENTS = {
  AUTHENTICATE: 'authenticate',
};

export const ROOM_EVENTS = {
  // To join a room. Also sent back upon successful join.
  JOIN_ROOM: 'join_room',

  // When a partner joins the room.
  JOINED_ROOM: 'joined_room',

  // Various exceptions
  ROOM_DOES_NOT_EXIST: 'room_does_not_exist',
  ALREADY_IN_ROOM: 'already_in_room',
  IN_ANOTHER_TAB: 'in_another_tab', // when user is in the room but in another tab
  ROOM_IS_FULL: 'room_is_full',
  ROOM_IS_CLOSED: 'room_is_closed',

  // To end the session. Also sent back upon successful closure.
  CLOSE_ROOM: 'close_room',

  // When the partner disconnects
  PARTNER_DISCONNECTED: 'partner_disconnected',
};

export const CODE_EVENTS = {
  UPDATE_CODE: 'update_code',
  UPDATE_LANGUAGE: 'update_language',
  UPDATE_CURSOR: 'update_cursor',
};

export const NOTES_EVENTS = {
  UPDATE_NOTES: 'update_notes',
};
