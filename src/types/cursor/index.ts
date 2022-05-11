export interface Position {
  row: number;
  column: number;
}

export interface Cursor {
  start: Position;
  end: Position;
}

export const initDefaultCursor = (): Cursor => {
  return {
    start: {
      row: 0,
      column: 0,
    },
    end: {
      row: 0,
      column: 0,
    },
  };
};
