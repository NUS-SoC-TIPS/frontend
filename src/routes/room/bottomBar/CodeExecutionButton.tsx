import { ReactElement } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from 'app/hooks';
import { executeCode } from 'lib/codeSocket';

interface Props {
  socket: Socket;
}

export const CodeExecutionButton = ({
  socket,
}: Props): ReactElement<Props, typeof Button> => {
  const { language, executableLanguageToVersionMap, isExecuting } =
    useAppSelector((state) => state.code);
  const versionName = executableLanguageToVersionMap[language];
  if (versionName == null) {
    return (
      <Tooltip label="Execution is not supported for this language">
        <Button disabled={true} size="sm" variant="secondary">
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
