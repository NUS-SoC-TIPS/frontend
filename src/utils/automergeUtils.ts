/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Adapted from https://github.com/jonfk/text-crdt-experiment-automerge-ts, which adapted
// it from https://lorefnon.tech/2018/09/23/using-google-diff-match-patch-with-automerge-text/

import Automerge from 'automerge';
import DiffMatchPatch from 'diff-match-patch';

import { Doc, TextDoc } from 'types/automerge';

let wasNewLine = false;
// const prevPatch: DiffMatchPatch.patch_obj | null = null;

export enum ChangeReaction {
  DO_NOT_PROCEED,
  PROCEED,
  SET_TIMEOUT,
  CLEAR_TIMEOUT,
}

/**
 * Returns two values: a doc and a boolean. The boolean denotes whether the change was valid.
 * If valid, the doc will be an updated doc. Else the doc would be the original doc passed in.
 */
export const changeTextDoc = (
  doc: Doc,
  updatedText: string,
): [Doc, ChangeReaction] => {
  const dmp = new DiffMatchPatch.diff_match_patch();

  // Compute the diff:
  const diff = dmp.diff_main(doc.text.toString(), updatedText);
  // diff is simply an array of binary tuples representing the change
  // [[-1,"The ang"],[1,"Lucif"],[0,"e"],[-1,"l"],[1,"r"],[0," shall "],[-1,"fall"],[1,"rise"]]

  // This cleans up the diff so that the diff is more human friendly.
  dmp.diff_cleanupSemantic(diff);
  // [[-1,"The angel"],[1,"Lucifer"],[0," shall "],[-1,"fall"],[1,"rise"]]

  const patches = dmp.patch_make(doc.text.toString(), diff);
  // console.log(patches);

  if (!patches) {
    return [doc, ChangeReaction.DO_NOT_PROCEED];
  }

  const finalPatch = patches[patches.length - 1];
  let wasTabbedNewLine = false;

  if (wasNewLine) {
    wasTabbedNewLine =
      finalPatch.diffs.length >= 2 &&
      finalPatch.diffs[1][0] === 1 &&
      finalPatch.diffs[1][1] === '\t\n';
    // if (!wasTabbedNewLine) {
    //   patches.push(prevPatch!);
    // }
    wasNewLine = false;
  } else {
    wasNewLine =
      finalPatch.diffs.length >= 2 &&
      finalPatch.diffs[1][0] === 1 &&
      finalPatch.diffs[1][1] === '\n';
    // if (wasNewLine) {
    //   patches = patches.slice(0, -1);
    //   if (!patches) {
    //     return [doc, false];
    //   }
    // }
  }

  // A patch object wraps the diffs along with some change metadata:
  //
  // [{
  //   "diffs":[[-1,"The angel"],[1,"Lucifer"],[0," shall "],[-1,"fall"], [1,"rise"]],
  //   "start1":0,
  //   "start2":0,
  //   "length1":20,
  //   "length2":18
  // }]

  // We can use the patch to derive the changedText from the sourceText
  // console.log(dmp.patch_apply(patches, doc.text.toString())[0]); // "Lucifer shall rise"

  // Now we translate these patches to operations against Automerge.Text instance:
  const newDoc = Automerge.change(Automerge.clone(doc), (doc1) => {
    patches.forEach((patch) => {
      let idx = patch.start1;
      if (idx !== null) {
        patch.diffs.forEach(([operation, changeText]) => {
          switch (operation) {
            case 1: // Insertion
              doc1.text.insertAt?.bind(doc1.text)!(
                idx!,
                ...changeText.split(''),
              );
              idx! += changeText.length;
              break;
            case 0: // No Change
              idx! += changeText.length;
              break;
            case -1: // Deletion
              for (let i = 0; i < changeText.length; i++) {
                doc1.text.deleteAt!(idx!);
              }
              break;
          }
        });
      }
    });
  });
  return [
    newDoc,
    wasNewLine
      ? ChangeReaction.SET_TIMEOUT
      : wasTabbedNewLine
      ? ChangeReaction.CLEAR_TIMEOUT
      : ChangeReaction.PROCEED,
  ];
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
