import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Language } from 'types/models/code';

export enum CodeExecutionError {
  FAILED_TO_START_EXECUTION,
  EXECUTION_TIMED_OUT,
}

export interface CodeState {
  language: Language;
  executableLanguageToVersionMap: { [language: string]: string };
  isExecuting: boolean;
  executionError: CodeExecutionError | null;
}

const initialState: CodeState = {
  language: Language.PYTHON_THREE,
  executableLanguageToVersionMap: {},
  isExecuting: false,
  executionError: null,
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
      action: PayloadAction<{
        isExecuting: boolean;
        executionError: CodeExecutionError | null;
      }>,
    ): void => {
      state.isExecuting = action.payload.isExecuting;
      state.executionError = action.payload.executionError;
    },
  },
});

export const {
  setLanguage,
  setExecutableLanguageToVersionMap,
  setIsExecuting,
} = codeSlice.actions;

export default codeSlice.reducer;
