import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PanelState {
  notes: string;
  executionOutput: string | null;
  statusDescription: string | null;
  isErrorOutput: boolean;
}

const initialState: PanelState = {
  notes: '',
  executionOutput: null,
  statusDescription: null,
  isErrorOutput: false,
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
      action: PayloadAction<{
        output: string;
        statusDescription: string;
        isError: boolean;
      }>,
    ) => {
      state.executionOutput = action.payload.output;
      state.statusDescription = action.payload.statusDescription;
      state.isErrorOutput = action.payload.isError;
    },
    resetPanelState: (state: PanelState) => {
      state.notes = '';
      state.executionOutput = null;
      state.statusDescription = null;
      state.isErrorOutput = false;
    },
  },
});

export const { setNotes, setExecutionOutput, resetPanelState } =
  panelSlice.actions;

export default panelSlice.reducer;
