import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PanelState {
  notes: string;
  executionOutput: string | null;
  isExecutionError: boolean;
}

const initialState: PanelState = {
  notes: '',
  executionOutput: null,
  isExecutionError: false,
};

export const panelSlice = createSlice({
  name: 'panel',
  initialState,
  reducers: {
    setNotes: (state: PanelState, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setExecutionOutput: (
      state: PanelState,
      action: PayloadAction<{ output: string; isError: boolean }>,
    ) => {
      state.executionOutput = action.payload.output;
      state.isExecutionError = action.payload.isError;
    },
    resetPanelState: (state: PanelState) => {
      state.notes = '';
      state.executionOutput = null;
      state.isExecutionError = false;
    },
  },
});

export const { setNotes, setExecutionOutput, resetPanelState } =
  panelSlice.actions;

export default panelSlice.reducer;
