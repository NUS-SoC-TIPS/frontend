import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { defaultKeymap, indentLess, indentMore } from '@codemirror/commands';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';
import { Socket } from 'socket.io-client';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { Doc } from 'yjs';

import { Language } from 'types/models/code';

import { colors, oneDarkBackgroundColor } from './colors';
import { getLanguageExtension } from './languages';
import { YjsProvider } from './YjsProvider';
import './CodeEditor.scss';

const userColor = colors[0];

interface Props {
  language: Language | null;
  username: string;
  socket: Socket;
  roomSlug: string;
  width?: string;
  height?: string;
}

export const CodeEditor = ({
  height,
  width,
  socket,
  roomSlug,
  language,
  username,
}: Props): ReactElement<Props, 'div'> => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const [element, setElement] = useState<HTMLElement>();
  const [view, setView] = useState<EditorView>();
  const languageCompartment = useMemo(() => new Compartment(), []);

  const ref = useCallback((node: HTMLElement | null): void => {
    if (!node) {
      return;
    }

    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) {
      return;
    }

    const yDoc = new Doc();
    const provider = new YjsProvider(socket, yDoc);
    const yText = yDoc.getText(roomSlug);

    provider.awareness.setLocalStateField('user', {
      name: username,
      color: userColor.color,
      colorLight: userColor.light,
    });

    const view = new EditorView({
      state: EditorState.create({
        doc: yText.toString(),
        extensions: [
          keymap.of([
            ...defaultKeymap,
            ...yUndoManagerKeymap,
            {
              key: 'Tab',
              preventDefault: true,
              run: indentMore,
            },
            {
              key: 'Shift-Tab',
              preventDefault: true,
              run: indentLess,
            },
          ]),
          basicSetup,
          languageCompartment.of(getLanguageExtension(language)),
          EditorView.lineWrapping,
          yCollab(yText, provider.awareness),
          ...(isDark ? [oneDark] : []),
          EditorView.theme({}, { dark: isDark }),
        ],
      }),
      parent: element,
    });
    setView(view);

    return (): void => {
      view?.destroy();
      provider.disconnect();
      yDoc.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, isDark, username, roomSlug]);

  useEffect(() => {
    if (view && language) {
      view.dispatch({
        effects: languageCompartment.reconfigure(
          getLanguageExtension(language),
        ),
      });
    }
  }, [language, languageCompartment, view]);

  return (
    <div
      ref={ref}
      style={{
        height,
        width,
        backgroundColor: isDark ? oneDarkBackgroundColor : 'snow',
      }}
    />
  );
};
