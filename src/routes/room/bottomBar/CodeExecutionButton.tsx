import { ReactElement, useEffect } from 'react';
import { Button, Tooltip, useToast } from '@chakra-ui/react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from '@/app/hooks';
import { ERROR_TOAST_PROPS } from '@/constants/toast';
import { executeCode } from '@/lib/codeSocket';
import { CodeExecutionError } from '@/reducers/codeReducer';

interface Props {
  socket: Socket;
}

export const CodeExecutionButton = ({
  socket,
}: Props): ReactElement<Props, typeof Button> => {
  const {
    language,
    executableLanguageToVersionMap,
    isExecuting,
    executionError,
  } = useAppSelector((state) => state.code);
  const versionName = executableLanguageToVersionMap[language];
  const toast = useToast();

  useEffect(() => {
    if (executionError === CodeExecutionError.FAILED_TO_START_EXECUTION) {
      toast({
        ...ERROR_TOAST_PROPS,
        title: 'Failed to start execution!',
      });
    } else if (executionError === CodeExecutionError.EXECUTION_TIMED_OUT) {
      toast({
        ...ERROR_TOAST_PROPS,
        title: 'Execution timed out!',
      });
    }
  }, [executionError, toast]);

  if (versionName == null) {
    return (
      <Tooltip label="Execution is not supported for this language">
        <Button isDisabled={true} size="sm" variant="secondary">
          Execute Code
        </Button>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={versionName}>
      <Button
        isLoading={isExecuting}
        onClick={(): void => executeCode(socket)}
        size="sm"
        variant="secondary"
      >
        Execute Code
      </Button>
    </Tooltip>
  );
};
