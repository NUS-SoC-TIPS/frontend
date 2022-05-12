import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Doc } from 'types/automerge';
import { Cursor, initDefaultCursor, Position } from 'types/cursor';
import { Language } from 'types/models/code';
import {
  applyChanges as automergeApplyChanges,
  initDocWithText,
} from 'utils/automergeUtils';
import {
  computeNext,
  CursorCrdt,
  initCursorCrdt,
  updateCurrentCursor,
} from 'utils/cursorCrdtUtils';

export interface CodeState {
  doc: Doc;
  language: Language;
  cursor: CursorCrdt;
  partnerCursor: Cursor;
}

const initialState: CodeState = {
  doc: initDocWithText(''),
  language: Language.PYTHON,
  cursor: initCursorCrdt(),
  partnerCursor: initDefaultCursor(),
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
      state.cursor = computeNext(state.cursor, state.doc, newDoc);
      state.doc = newDoc;
    },
    updatePartnerCursor: (state, action: PayloadAction<Cursor>): void => {
      state.partnerCursor = action.payload;
    },
    clearNext: (state): void => {
      state.cursor = { ...state.cursor, hasNext: false };
    },
    setPosition: (state, action: PayloadAction<Position>): void => {
      state.cursor = updateCurrentCursor(state.cursor, action.payload);
    },
  },
});

export const {
  setDoc,
  setLanguage,
  applyChanges,
  updatePartnerCursor,
  clearNext,
  setPosition,
} = codeSlice.actions;

export default codeSlice.reducer;
