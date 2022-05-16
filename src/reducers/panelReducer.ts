import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PanelState {
  notes: string;
}

const initialState: PanelState = {
  notes: '',
};

export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    setNotes: (state: PanelState, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    resetPanelState: (state: PanelState) => {
      state.notes = '';
    },
  },
});

export const { setNotes, resetPanelState } = panelSlice.actions;

export default panelSlice.reducer;
