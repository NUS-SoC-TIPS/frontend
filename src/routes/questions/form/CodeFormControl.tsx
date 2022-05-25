import { ReactElement } from 'react';

import { SimpleCodeEditor } from 'components/codeEditor';
import { FormControl } from 'components/formControl';
import { Language } from 'types/models/code';

interface Props {
  code: string;
  language: Language | null;
  onChange: (code: string) => void;
}

export const CodeFormControl = ({
  code,
  language,
  onChange,
}: Props): ReactElement<Props, typeof FormControl> => {
  return (
    <FormControl id="code" label="Code Written">
      <SimpleCodeEditor
        height="15rem"
        language={language}
        onChange={onChange}
        value={code}
        width="100%"
      />
    </FormControl>
  );
};
