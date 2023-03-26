import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { defaultKeymap, history, indentWithTab } from '@codemirror/commands';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import { EditorState, Extension } from '@codemirror/state';
import {
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';
import { emacs } from '@replit/codemirror-emacs';
import { CodeMirror, Vim, vim } from '@replit/codemirror-vim';
import { vscodeKeymap } from '@replit/codemirror-vscode-keymap';
import { basicSetup } from 'codemirror';
import { yUndoManagerKeymap } from 'y-codemirror.next';

import { KeyBinding } from 'types/models/code';

export const getKeyBindingExtensions = (
  keyBinding: KeyBinding,
): Extension[] => {
  switch (keyBinding) {
    case KeyBinding.STANDARD:
      return getDefaultKeyBindingExtensions();
    case KeyBinding.VIM:
      return getVimKeyBindingExtensions();
    case KeyBinding.EMACS:
      return getEmacsKeyBindingExtensions();
    case KeyBinding.VS_CODE:
      return getVsCodeKeyBindingExtensions();
  }
};

const getDefaultKeyBindingExtensions = (): Extension[] => {
  return [
    keymap.of([...defaultKeymap, ...yUndoManagerKeymap, indentWithTab]),
    basicSetup,
  ];
};

const getVimKeyBindingExtensions = (): Extension[] => {
  overrideVimUndo();
  overrideVimRedo();
  return [
    vim({ status: true }),
    keymap.of([...yUndoManagerKeymap, indentWithTab]),
    basicSetup,
  ];
};

const getEmacsKeyBindingExtensions = (): Extension[] => {
  // TODO: Handle indents + undo + redo
  return [emacs(), basicSetup];
};

const getVsCodeKeyBindingExtensions = (): Extension[] => {
  return [
    // Basically basicSetup but without the keymap
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([...yUndoManagerKeymap, ...vscodeKeymap]),
  ];
};

const overrideVimUndo = (): void => {
  const yjsUndo = yUndoManagerKeymap.filter((k) => k.key === 'Mod-z')[0]?.run;
  if (yjsUndo != null) {
    // Referenced from https://github.com/replit/codemirror-vim/blob/d7d9ec2ab438571f500dfd21b37da733fdba47fe/src/cm_adapter.ts#L117-L127
    const wrappedYjsUndo = (cm: CodeMirror): void => {
      if (cm.curOp) {
        cm.curOp.$changeStart = undefined;
      }
      yjsUndo(cm.cm6);
      const changeStartIndex = cm.curOp?.$changeStart;
      // vim mode expects the changed text to be either selected or cursor placed at the start
      if (changeStartIndex != null) {
        cm.cm6.dispatch({ selection: { anchor: changeStartIndex } });
      }
    };

    Vim.defineEx('undo', 'u', wrappedYjsUndo);
    Vim.defineAction(
      'undo',
      function (cm: CodeMirror, actionArgs: { repeat: number }) {
        cm.operation(function () {
          for (let i = 0; i < actionArgs.repeat; i++) {
            wrappedYjsUndo(cm);
          }
          // Clip cursor, referenced from https://github.com/replit/codemirror-vim/blob/d7d9ec2ab438571f500dfd21b37da733fdba47fe/src/vim.js#L3044-L3062
          const cur = cm.getCursor('start');
          const vim = cm.state.vim;
          const includeLineBreak = vim.insertMode || vim.visualMode;
          const line = Math.min(
            Math.max(cm.firstLine(), cur.line),
            cm.lastLine(),
          );
          const text = cm.getLine(line);
          const maxCh = text.length - 1 + Number(!!includeLineBreak);
          let ch = Math.min(Math.max(0, cur.ch), maxCh);
          // prevent cursor from entering surrogate pair
          const charCode = text.charCodeAt(ch);
          if (0xdc00 <= charCode && charCode <= 0xdfff) {
            const direction = 1;
            ch += direction;
            if (ch > maxCh) {
              ch -= 2;
            }
          }
          cm.setCursor(line, ch);
        });
      },
    );
  }
};

const overrideVimRedo = (): void => {
  const yjsRedo = yUndoManagerKeymap.filter((k) => k.key === 'Mod-y')[0]?.run;
  if (yjsRedo != null) {
    // Referenced from https://github.com/replit/codemirror-vim/blob/d7d9ec2ab438571f500dfd21b37da733fdba47fe/src/cm_adapter.ts#L117-L127
    const wrappedYjsRedo = (cm: CodeMirror): void => {
      if (cm.curOp) {
        cm.curOp.$changeStart = undefined;
      }
      yjsRedo(cm.cm6);
      const changeStartIndex = cm.curOp?.$changeStart;
      // vim mode expects the changed text to be either selected or cursor placed at the start
      if (changeStartIndex != null) {
        cm.cm6.dispatch({ selection: { anchor: changeStartIndex } });
      }
    };

    Vim.defineEx('redo', 'red', wrappedYjsRedo);
    Vim.defineAction(
      'redo',
      function (cm: CodeMirror, actionArgs: { repeat: number }) {
        for (let i = 0; i < actionArgs.repeat; i++) {
          wrappedYjsRedo(cm);
        }
      },
    );
  }
};
