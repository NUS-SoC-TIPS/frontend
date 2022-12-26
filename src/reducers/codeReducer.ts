import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Language } from 'types/models/code';

export interface CodeState {
  language: Language;
  executableLanguageToVersionMap: { [language: string]: string };
}

const initialState: CodeState = {
  language: Language.PYTHON_THREE,
  executableLanguageToVersionMap: {},
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>): void => {
      state.language = action.payload;
    },
    setExecutableLanguageToVersionMap: (
      state,
      action: PayloadAction<{ [language: string]: string }>,
    ): void => {
      state.executableLanguageToVersionMap = action.payload;
    },
  },
});

export const { setLanguage, setExecutableLanguageToVersionMap } =
  codeSlice.actions;

export default codeSlice.reducer;
