import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { lezer } from '@codemirror/lang-lezer';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { StreamLanguage } from '@codemirror/language';
import { c, csharp, kotlin, scala } from '@codemirror/legacy-modes/mode/clike';
import { erlang } from '@codemirror/legacy-modes/mode/erlang';
import { go } from '@codemirror/legacy-modes/mode/go';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { scheme } from '@codemirror/legacy-modes/mode/scheme';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { Extension } from '@codemirror/state';
import { elixir } from 'codemirror-lang-elixir';

import { Language } from 'types/models/code';

export const getLanguageExtension = (language: Language | null): Extension => {
  switch (language) {
    case Language.C_PLUS_PLUS:
      return cpp();
    case Language.C:
      return StreamLanguage.define(c);
    case Language.JAVA:
      return java();
    case Language.PYTHON:
    case Language.PYTHON_THREE:
      return python();
    case Language.C_SHARP:
      return StreamLanguage.define(csharp);
    case Language.JAVASCRIPT:
      return javascript();
    case Language.RUBY:
      return StreamLanguage.define(ruby);
    case Language.SWIFT:
      return StreamLanguage.define(swift);
    case Language.GO:
      return StreamLanguage.define(go);
    case Language.SCALA:
      return StreamLanguage.define(scala);
    case Language.KOTLIN:
      return StreamLanguage.define(kotlin);
    case Language.RUST:
      return rust();
    case Language.PHP:
      return php();
    case Language.TYPESCRIPT:
      return javascript({ typescript: true });
    case Language.RACKET:
      return StreamLanguage.define(scheme);
    case Language.ERLANG:
      return StreamLanguage.define(erlang);
    case Language.ELIXIR:
      return StreamLanguage.define(elixir);
    case Language.BASH:
      return StreamLanguage.define(shell);
    case Language.MY_SQL:
    case Language.MS_SQL_SERVER:
    case Language.ORACLE:
      return sql();
  }
  return lezer();
};
