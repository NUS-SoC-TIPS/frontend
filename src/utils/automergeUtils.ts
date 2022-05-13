/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Adapted from https://github.com/jonfk/text-crdt-experiment-automerge-ts, which adapted
// it from https://lorefnon.tech/2018/09/23/using-google-diff-match-patch-with-automerge-text/

import Automerge from 'automerge';

import { Doc, TextDoc } from 'types/automerge';
import { ChangeEvent } from 'types/automerge/ace';

/**
 * Returns two values: a doc and a boolean. The boolean denotes whether the change was valid.
 * If valid, the doc will be an updated doc. Else the doc would be the original doc passed in.
 */
export const changeTextDoc = (doc: Doc, change: ChangeEvent): Doc => {
  const docString = doc.text.toString();
  const lines = docString.split('\n');
  const changedLine = change.lines.join('\n');
  let startIndex = change.start.column;
  for (let i = 0; i < change.start.row; i += 1) {
    startIndex += lines[i].length + 1; // + 1 for the \n character
  }

  return Automerge.change(Automerge.clone(doc), (doc1) => {
    if (change.action === 'insert') {
      doc1.text.insertAt?.bind(doc1.text)!(
        startIndex,
        ...changedLine.split(''),
      );
    } else {
      for (let i = 0; i < changedLine.length; i++) {
        doc1.text.deleteAt!(startIndex);
      }
    }
  });
};

export const initEmptyDoc = (): Doc => {
  return Automerge.init();
};

export const initDocWithText = (text: string): Doc => {
  return Automerge.change(Automerge.init<TextDoc>(), (doc) => {
    doc.text = new Automerge.Text(text);
    return doc.text.insertAt?.bind(doc.text)!(0, ...text.split(''));
  });
};

export const getChanges = (oldDoc: Doc, newDoc: Doc): string[] => {
  return binaryChangeToBase64String(Automerge.getChanges(oldDoc, newDoc));
};

export const applyChanges = (doc: Doc, allChanges: string[]): Doc => {
  const changes = base64StringToBinaryChange(allChanges);
  const [newDoc] = Automerge.applyChanges<Doc>(Automerge.clone(doc), changes);

  return newDoc;
};

export const getElementIds = (doc: Doc): string[] => {
  return Automerge.Frontend.getElementIds(doc.text);
};

export const binaryChangeToBase64String = (
  a: Automerge.BinaryChange[],
): string[] => {
  return a.map((b) => window.btoa(String.fromCharCode(...b)));
};

export const base64StringToBinaryChange = (
  s: string[],
): Automerge.BinaryChange[] => {
  return s.map((a) => {
    const asciiString = window.atob(a);
    return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)));
  }) as Automerge.BinaryChange[];
};
