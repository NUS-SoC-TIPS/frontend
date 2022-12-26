import { Socket } from 'socket.io-client';

import { store } from 'app/store';
import { CODE_EVENTS } from 'constants/events';
import {
  CodeExecutionError,
  setIsExecuting,
  setLanguage,
} from 'reducers/codeReducer';
import { setExecutionOutput } from 'reducers/panelReducer';
import { Language } from 'types/models/code';

export const updateLanguage = (socket: Socket, language: Language): void => {
  store.dispatch(setLanguage(language));
  socket.emit(CODE_EVENTS.UPDATE_LANGUAGE, language);
};

export const executeCode = (socket: Socket): void => {
  socket.emit(CODE_EVENTS.EXECUTE_CODE);
};

const handleUpdateLanguage = (socket: Socket): void => {
  socket.on(CODE_EVENTS.UPDATE_LANGUAGE, (language: Language) => {
    store.dispatch(setLanguage(language));
  });
};

const handleExecuteCode = (socket: Socket): void => {
  socket.on(CODE_EVENTS.EXECUTE_CODE, () => {
    store.dispatch(setIsExecuting({ isExecuting: true, executionError: null }));
  });
};

const handleFailedToStartExecution = (socket: Socket): void => {
  socket.on(CODE_EVENTS.FAILED_TO_START_EXECUTION, () => {
    store.dispatch(
      setIsExecuting({
        isExecuting: false,
        executionError: CodeExecutionError.FAILED_TO_START_EXECUTION,
      }),
    );
  });
};

const handleExecutionTimedOut = (socket: Socket): void => {
  socket.on(CODE_EVENTS.EXECUTION_TIMED_OUT, () => {
    store.dispatch(
      setIsExecuting({
        isExecuting: false,
        executionError: CodeExecutionError.EXECUTION_TIMED_OUT,
      }),
    );
  });
};

const handleExecutionCompleted = (socket: Socket): void => {
  socket.on(
    CODE_EVENTS.EXECUTION_COMPLETED,
    (data: { isError: boolean; output: string; statusDescription: string }) => {
      const { isError, output, statusDescription } = data;
      store.dispatch(
        setIsExecuting({ isExecuting: false, executionError: null }),
      );
      store.dispatch(
        setExecutionOutput({
          output: isError ? `${statusDescription}\n${output}` : output,
          isError,
        }),
      );
    },
  );
};

export const initSocketForCode = (socket: Socket): void => {
  handleUpdateLanguage(socket);
  handleExecuteCode(socket);
  handleFailedToStartExecution(socket);
  handleExecutionTimedOut(socket);
  handleExecutionCompleted(socket);
};
