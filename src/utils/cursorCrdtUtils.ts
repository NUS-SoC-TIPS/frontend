import { Doc } from 'types/automerge';
import { Position } from 'types/cursor';

import { getElementIds } from './automergeUtils';

// We only track a single position, not a pair, because
// ace editor only shifts cursors to a single position.
export interface CursorCrdt {
  currentCursor: Position;
  nextCursor: Position;
  hasNext: boolean;
}

export const initCursorCrdt = (): CursorCrdt => {
  return {
    currentCursor: {
      row: 0,
      column: 0,
    },
    nextCursor: {
      row: 0,
      column: 0,
    },
    hasNext: false,
  };
};

export const updateCurrentCursor = (
  crdt: CursorCrdt,
  currentCursor: Position,
): CursorCrdt => {
  return {
    ...crdt,
    currentCursor: {
      ...currentCursor,
    },
  };
};

export const computeNext = (
  crdt: CursorCrdt,
  oldDoc: Doc,
  newDoc: Doc,
): CursorCrdt => {
  const position = crdt.currentCursor;
  if (crdt.currentCursor.row === 0 && crdt.currentCursor.column === 0) {
    return { ...crdt, hasNext: false };
  }
  const oldText = oldDoc.text.toString();

  let i = 0;
  let numRows = 0;
  let numCols = 0;
  for (; ; i += 1) {
    if (numCols === position.column && numRows === position.row) {
      break;
    }
    if (numRows === position.row) {
      numCols += 1;
      continue;
    }
    if (oldText[i] === '\n') {
      numRows += 1;
      continue;
    }
  }

  const oldElementIds = getElementIds(oldDoc);
  const newElementIds = getElementIds(newDoc);
  let index = newElementIds.findIndex((id) => id === oldElementIds[i]);
  if (index === -1) {
    // The position was deleted, so we will go back and find the
    // latest index that still exists.
    const newElemIdsSet = new Set(newElementIds);
    for (let x = i - 1; x >= 0; x = x - 1) {
      if (newElemIdsSet.has(oldElementIds[x])) {
        index = newElementIds.findIndex((id) => id === oldElementIds[x]) + 1;
        break;
      }
      // Cannot find match, set it to first position of doc
      if (x === 0) {
        index = 0;
      }
    }
  }

  const newText = newDoc.text.toString();
  numRows = 0;
  numCols = 0;
  for (i = 0; i < index; i = i + 1) {
    if (newText[i] === '\n') {
      numRows += 1;
      numCols = 0;
      continue;
    }
    numCols += 1;
  }
  return {
    ...crdt,
    nextCursor: {
      row: numRows,
      column: numCols,
    },
    hasNext: true,
  };
};
