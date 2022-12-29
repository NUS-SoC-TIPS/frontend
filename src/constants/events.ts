export const GENERAL_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  CONNECT_FAILED: 'connect_failed',
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
  CLOSING_ROOM: 'closing_room', // To trigger loading state

  // When the partner disconnects
  PARTNER_DISCONNECTED: 'partner_disconnected',

  // General errors, sent from server
  JOIN_ROOM_FAILED: 'join_room_failed',
  CLOSE_ROOM_FAILED: 'close_room_failed',
};

export const CODE_EVENTS = {
  // YJS synchronisation
  CONNECT_YJS: 'connect_yjs',
  UPDATE_YJS: 'update_yjs',

  // To notify of a change in language used for the room
  UPDATE_LANGUAGE: 'update_language',

  // To handle code execution
  EXECUTE_CODE: 'execute_code',
  FAILED_TO_START_EXECUTION: 'failed_to_start_execution',
  EXECUTION_TIMED_OUT: 'execution_timed_out',
  EXECUTION_COMPLETED: 'execution_completed',
};

export const NOTES_EVENTS = {
  UPDATE_NOTES: 'update_notes',
};
