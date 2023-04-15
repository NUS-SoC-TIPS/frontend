import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { lezer } from '@codemirror/lang-lezer';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import { StreamLanguage } from '@codemirror/language';
import {
  c,
  csharp,
  kotlin,
  objectiveC,
  scala,
} from '@codemirror/legacy-modes/mode/clike';
import { cobol } from '@codemirror/legacy-modes/mode/cobol';
import { commonLisp } from '@codemirror/legacy-modes/mode/commonlisp';
import { erlang } from '@codemirror/legacy-modes/mode/erlang';
import { fortran } from '@codemirror/legacy-modes/mode/fortran';
import { go } from '@codemirror/legacy-modes/mode/go';
import { haskell } from '@codemirror/legacy-modes/mode/haskell';
import { fSharp, oCaml } from '@codemirror/legacy-modes/mode/mllike';
import { pascal } from '@codemirror/legacy-modes/mode/pascal';
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
    case Language.JAVA:
      return java();
    case Language.PYTHON:
    case Language.PYTHON_THREE:
      return python();
    case Language.C:
      return StreamLanguage.define(c);
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
    case Language.DART:
      break; // no support for now
    case Language.MY_SQL:
    case Language.MS_SQL_SERVER:
    case Language.ORACLE:
      return sql();
    case Language.BASH:
      return StreamLanguage.define(shell);
    case Language.APL:
      break; // no support for now
    case Language.COBOL:
      return StreamLanguage.define(cobol);
    case Language.LISP:
      return StreamLanguage.define(commonLisp);
    case Language.F_SHARP:
      return StreamLanguage.define(fSharp);
    case Language.FORTRAN:
      return StreamLanguage.define(fortran);
    case Language.GERBIL:
      break; // no support for now
    case Language.HASKELL:
      return StreamLanguage.define(haskell);
    case Language.JULIA:
      break; // no support for now
    case Language.OBJECTIVE_C:
      return StreamLanguage.define(objectiveC);
    case Language.OCAML:
      return StreamLanguage.define(oCaml);
    case Language.PASCAL:
      return StreamLanguage.define(pascal);
    case Language.PROLOG:
    // no-op as no support for now
  }
  return lezer();
};
