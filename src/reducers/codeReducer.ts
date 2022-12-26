import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Language } from 'types/models/code';

export interface CodeState {
  language: Language;
  executableLanguageToVersionMap: { [language: string]: string };
  isExecuting: boolean;
}

const initialState: CodeState = {
  language: Language.PYTHON_THREE,
  executableLanguageToVersionMap: {},
  isExecuting: false,
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setLanguage: (state: CodeState, action: PayloadAction<Language>): void => {
      state.language = action.payload;
    },
    setExecutableLanguageToVersionMap: (
      state: CodeState,
      action: PayloadAction<{ [language: string]: string }>,
    ): void => {
      state.executableLanguageToVersionMap = action.payload;
    },
    setIsExecuting: (
      state: CodeState,
      action: PayloadAction<boolean>,
    ): void => {
      state.isExecuting = action.payload;
    },
  },
});

export const {
  setLanguage,
  setExecutableLanguageToVersionMap,
  setIsExecuting,
} = codeSlice.actions;

export default codeSlice.reducer;
