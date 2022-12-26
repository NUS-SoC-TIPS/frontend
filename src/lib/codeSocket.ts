import { Socket } from 'socket.io-client';

import { store } from 'app/store';
import { CODE_EVENTS } from 'constants/events';
import { setIsExecuting, setLanguage } from 'reducers/codeReducer';
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
    store.dispatch(setIsExecuting(true));
  });
};

const handleFailedToStartExecution = (socket: Socket): void => {
  socket.on(CODE_EVENTS.EXECUTE_CODE, () => {
    store.dispatch(setIsExecuting(false));
    // TODO: Show an error dialog
  });
};

const handleExecutionTimedOut = (socket: Socket): void => {
  socket.on(CODE_EVENTS.EXECUTE_CODE, () => {
    store.dispatch(setIsExecuting(false));
    // TODO: Show an error dialog
  });
};

const handleExecutionCompleted = (socket: Socket): void => {
  socket.on(
    CODE_EVENTS.EXECUTE_CODE,
    (data: { isError: boolean; output: string; statusDescription: string }) => {
      const { isError, output, statusDescription } = data;
      store.dispatch(setIsExecuting(false));
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
