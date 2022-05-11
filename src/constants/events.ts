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
  ROOM_IS_FULL: 'room_is_full',
  ROOM_IS_CLOSED: 'room_is_closed',

  // To end the session. Also sent back upon successful closure.
  CLOSE_ROOM: 'close_room',
  // Sent to block any further changes while room is closing.
  CLOSING_ROOM: 'closing_room',

  // When the partner disconnects
  PARTNER_DISCONNECTED: 'partner_disconnected',
};