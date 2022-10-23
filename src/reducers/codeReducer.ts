import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Language } from 'types/models/code';

export interface CodeState {
  language: Language;
}

const initialState: CodeState = {
  language: Language.PYTHON_THREE,
};

const codeSlice = createSlice({
  name: 'code',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>): void => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = codeSlice.actions;

export default codeSlice.reducer;
