import { IMarker } from 'react-ace';

import { Cursor } from 'types/cursor';

export const convertCursorToIMarker = (
  cursor: Cursor,
  className: string,
  type: 'fullLine' | 'screenLine' | 'text',
): IMarker => {
  return {
    startRow: cursor.start.row,
    startCol: cursor.start.column,
    endRow: cursor.end.row,
    endCol: cursor.end.column,
    className,
    type,
  };
};
