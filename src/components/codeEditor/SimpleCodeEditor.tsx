import { FC } from 'react';
import AceEditor from 'react-ace';

import { languageToMode } from 'constants/enumStrings';
import { Language } from 'types/models/code';

import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-c_cpp'; // For both C and C++
import 'ace-builds/src-noconflict/mode-cobol';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-elixir';
import 'ace-builds/src-noconflict/mode-erlang';
import 'ace-builds/src-noconflict/mode-fortran';
import 'ace-builds/src-noconflict/mode-fsharp';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-haskell';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-kotlin';
import 'ace-builds/src-noconflict/mode-lisp';
import 'ace-builds/src-noconflict/mode-mysql';
import 'ace-builds/src-noconflict/mode-objectivec';
import 'ace-builds/src-noconflict/mode-ocaml';
import 'ace-builds/src-noconflict/mode-pascal';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-plain_text'; // For when language is unspecified
import 'ace-builds/src-noconflict/mode-prolog'; // For when language is unspecified
import 'ace-builds/src-noconflict/mode-python'; // For both Python and Python 3
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-rust';
import 'ace-builds/src-noconflict/mode-scala';
import 'ace-builds/src-noconflict/mode-scheme'; // For Racket
import 'ace-builds/src-noconflict/mode-sh';
import 'ace-builds/src-noconflict/mode-sql'; // For Oracle
import 'ace-builds/src-noconflict/mode-sqlserver';
import 'ace-builds/src-noconflict/mode-swift';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/ext-language_tools';
import './theme-twilight';

interface Props {
  language: Language | null;
  value: string;
  onChange?: (code: string) => void;
  width?: string;
  height?: string;
}

export const SimpleCodeEditor: FC<Props> = ({
  language,
  onChange,
  value,
  width,
  height,
}) => {
  return (
    <AceEditor
      enableBasicAutocompletion={true}
      enableLiveAutocompletion={true}
      height={height}
      mode={language ? languageToMode[language] : 'plain_text'}
      name="code-editor"
      onChange={onChange ? (value): void => onChange(value) : undefined}
      readOnly={onChange == null}
      // Disable to standardise with the normal CodeEditor.tsx
      setOptions={{
        enableMultiselect: false,
        showFoldWidgets: false,
        useSoftTabs: false,
      }}
      showPrintMargin={false}
      theme="twilight"
      value={value}
      width={width}
      wrapEnabled={true}
    />
  );
};
