import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Doc } from 'types/automerge';
import { Language } from 'types/models/code';
import {
  applyChanges as automergeApplyChanges,
  initDocWithText,
} from 'utils/automergeUtils';

export interface CodeState {
  doc: Doc;
  language: Language;
}

const initialState: CodeState = {
  doc: initDocWithText(''),
  language: Language.PYTHON,
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setDoc: (state, action: PayloadAction<Doc>): void => {
      state.doc = action.payload;
    },
    setLanguage: (state, action: PayloadAction<Language>): void => {
      state.language = action.payload;
    },
    applyChanges: (state, action: PayloadAction<string[]>): void => {
      const newDoc = automergeApplyChanges(state.doc, action.payload);
      // TODO: Copy the cursor CRDT code over later
      state.doc = newDoc;
    },
  },
});

export const { setDoc, setLanguage, applyChanges } = codeSlice.actions;

export default codeSlice.reducer;
