import { ReactElement } from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

import { Language } from 'types/models/code';

interface Props {
  language: Language;
  executableLanguageToVersionMap: { [language: string]: string };
}

export const CodeExecutionButton = ({
  language,
  executableLanguageToVersionMap,
}: Props): ReactElement<Props, typeof Button> => {
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
        onClick={undefined} // TODO: Define this
        size="sm"
        variant="secondary"
      >
        Execute Code
      </Button>
    </Tooltip>
  );
};
