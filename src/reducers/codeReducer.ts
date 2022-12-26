import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Language } from 'types/models/code';

export interface CodeState {
  language: Language;
  executableLanguages: { [language: string]: string };
}

const initialState: CodeState = {
  language: Language.PYTHON_THREE,
  executableLanguages: {},
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>): void => {
      state.language = action.payload;
    },
    setExecutableLanguages: (
      state,
      action: PayloadAction<{ [language: string]: string }>,
    ): void => {
      state.executableLanguages = action.payload;
    },
  },
});

export const { setLanguage, setExecutableLanguages } = codeSlice.actions;

export default codeSlice.reducer;
