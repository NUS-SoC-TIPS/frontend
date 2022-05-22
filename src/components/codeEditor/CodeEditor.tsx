import { FC, useCallback, useEffect, useRef, useState } from 'react';
import AceEditor, { IMarker } from 'react-ace';
import { Ace } from 'ace-builds';

import { languageToMode } from 'constants/enumStrings';
import { ChangeEvent } from 'types/automerge/ace';
import { Cursor, Position } from 'types/cursor';
import { Language } from 'types/models/code';
import { convertCursorToIMarker } from 'utils/cursorUtils';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/ext-language_tools';
import './theme-twilight';

import './CodeEditor.scss';

interface Props {
  language: Language;
  onChange: (change: ChangeEvent) => void;
  onCursorChange: (data: Cursor) => void;
  value: string;
  width?: string;
  height?: string;

  // CRDT
  hasNextPosition: boolean;
  clearNextPosition: () => void;
  nextPosition: Position;
  position: Position;
  setPosition: (position: Position) => void;
  partnerCursor?: Cursor;
}

export const CodeEditor: FC<Props> = ({
  language,
  onChange,
  onCursorChange,
  value,
  width,
  height,
  hasNextPosition,
  clearNextPosition,
  nextPosition,
  position,
  setPosition,
  partnerCursor,
}) => {
  const [hasJustCopiedLine, setHasJustCopiedLine] = useState(false);
  const [lineCopied, setLineCopied] = useState('');
  const [markers, setMarkers] = useState<IMarker[]>([]);
  const ref = useRef<AceEditor | null>(null);

  useEffect(() => {
    if (hasNextPosition) {
      ref?.current?.editor.moveCursorTo(nextPosition.row, nextPosition.column);
      clearNextPosition();
    }
  }, [
    clearNextPosition,
    hasNextPosition,
    nextPosition.column,
    nextPosition.row,
  ]);

  const updateMarkers = useCallback(() => {
    if (partnerCursor) {
      const isNotSelection =
        partnerCursor.start.row === partnerCursor.end.row &&
        partnerCursor.start.column === partnerCursor.end.column;
      const markerCursor: Cursor = {
        ...partnerCursor,
        end: {
          ...partnerCursor.end,
          column: isNotSelection
            ? partnerCursor.end.column + 1
            : partnerCursor.end.column,
        },
      };
      setMarkers([
        convertCursorToIMarker(
          markerCursor,
          `marker${isNotSelection ? ' is-single' : ''}`,
          'text',
        ),
      ]);
    } else {
      setMarkers([]);
    }
  }, [partnerCursor]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  return (
    <AceEditor
      commands={[
        {
          name: 'customcopylinesdown',
          bindKey: { win: 'Shift-Alt-Down', mac: 'Shift-Option-Down' },
          exec: 'copylinesdown',
        },
        {
          name: 'customcopylinesup',
          bindKey: { win: 'Shift-Alt-Up', mac: 'Shift-Option-Up' },
          exec: 'copylinesup',
        },
        {
          name: 'custompaste',
          bindKey: { win: 'Ctrl-V', mac: 'Cmd-V' },
          exec: 'paste',
        },
        {
          name: 'customcut',
          bindKey: { win: 'Ctrl-X', mac: 'Cmd-X' },
          // This function is actually cached heavily, i.e. we cannot
          // refer to props within this function, because it is still
          // referencing the original props.
          exec: (editor: Ace.Editor): void => {
            const selection = editor.getCopyText();
            editor.execCommand('copy');
            if (!selection || selection === '') {
              editor.execCommand('removeline');
            } else {
              editor.execCommand('del');
            }
          },
        },
      ]}
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      height={height}
      markers={markers}
      mode={languageToMode[language]}
      name="code-editor"
      onChange={(_value, event): void => onChange(event as ChangeEvent)}
      onCopy={(text: string): void => {
        if (!text || text === '') {
          navigator.clipboard.writeText('');
          setHasJustCopiedLine(true);
          const row = position.row;
          const lines = value.split('\n');
          setLineCopied(lines[row]);
        } else {
          navigator.clipboard.writeText(text);
          setHasJustCopiedLine(false);
          setLineCopied('');
        }
      }}
      onCursorChange={(value): void => {
        setPosition({ row: value.cursor.row, column: value.cursor.column });
        onCursorChange({
          start: {
            row: value.cursor.row,
            column: value.cursor.column,
          },
          end: {
            row: value.cursor.row,
            column: value.cursor.column,
          },
        });
      }}
      onPaste={(text: string): void => {
        if ((!text || text === '') && hasJustCopiedLine) {
          const row = position.row + 1;
          onChange({
            action: 'insert' as const,
            start: {
              row,
              column: 0,
            },
            lines: [`${lineCopied}\n`],
          });
          ref?.current?.editor.execCommand('golinedown');
        }
      }}
      onSelectionChange={(value): void => {
        const { anchor, cursor } = value;
        onCursorChange({
          start: {
            row: Math.min(anchor.row, cursor.row),
            column: Math.min(anchor.column, cursor.column),
          },
          end: {
            row: Math.max(cursor.row, anchor.row),
            column: Math.max(cursor.column, anchor.column),
          },
        });
      }}
      ref={ref}
      // Disable so that we can efficiently compute the line changes
      setOptions={{
        enableMultiselect: false,
        showFoldWidgets: false,
        useSoftTabs: false,
      }}
      showPrintMargin={false}
      theme="twilight"
      value={value}
      width={width}
      wrapEnabled={true}
    />
  );
};
