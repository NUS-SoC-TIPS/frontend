import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { useColorMode } from '@chakra-ui/react';
import { defaultKeymap, indentLess, indentMore } from '@codemirror/commands';
import { Compartment, EditorState } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { basicSetup, EditorView } from 'codemirror';

import { Language } from 'types/models/code';

import { oneDarkBackgroundColor } from './colors';
import { getLanguageExtension } from './languages';
import './CodeEditor.scss';

interface Props {
  language: Language | null;
  value: string;
  onChange?: (code: string) => void;
  width?: string;
  height?: string;
}

export const SimpleCodeEditor = ({
  height,
  width,
  value,
  onChange,
  language,
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

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          keymap.of([
            ...defaultKeymap,
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
          ...(isDark ? [oneDark] : []),
          EditorView.theme({}, { dark: isDark }),
          EditorView.updateListener.of((e) => {
            onChange?.(e.state.doc.toJSON().join('\n'));
          }),
        ],
      }),
      parent: element,
    });
    setView(view);

    return (): void => view?.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, isDark, onChange]);

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
