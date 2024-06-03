import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { lezer } from '@codemirror/lang-lezer';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { MSSQL, MySQL, PLSQL, PostgreSQL, sql } from '@codemirror/lang-sql';
import { StreamLanguage } from '@codemirror/language';
import { apl } from '@codemirror/legacy-modes/mode/apl';
import {
  c,
  csharp,
  dart,
  kotlin,
  objectiveC,
  scala,
} from '@codemirror/legacy-modes/mode/clike';
import { cobol } from '@codemirror/legacy-modes/mode/cobol';
import { commonLisp } from '@codemirror/legacy-modes/mode/commonlisp';
import { crystal } from '@codemirror/legacy-modes/mode/crystal';
import { d } from '@codemirror/legacy-modes/mode/d';
import { erlang } from '@codemirror/legacy-modes/mode/erlang';
import { fortran } from '@codemirror/legacy-modes/mode/fortran';
import { haskell } from '@codemirror/legacy-modes/mode/haskell';
import { julia } from '@codemirror/legacy-modes/mode/julia';
import { lua } from '@codemirror/legacy-modes/mode/lua';
import { fSharp, oCaml } from '@codemirror/legacy-modes/mode/mllike';
import { octave } from '@codemirror/legacy-modes/mode/octave';
import { pascal } from '@codemirror/legacy-modes/mode/pascal';
import { perl } from '@codemirror/legacy-modes/mode/perl';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { scheme } from '@codemirror/legacy-modes/mode/scheme';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { smalltalk } from '@codemirror/legacy-modes/mode/smalltalk';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { vb } from '@codemirror/legacy-modes/mode/vb';
import { Extension } from '@codemirror/state';
import { elixir } from 'codemirror-lang-elixir';
import { prolog } from 'codemirror-lang-prolog';
import { zig } from 'codemirror-lang-zig';

import { Language } from '@/types/models/code';

export const getLanguageExtension = (language: Language | null): Extension => {
  switch (language) {
    case Language.C_PLUS_PLUS:
      return cpp();
    case Language.JAVA:
      return java();
    case Language.PYTHON:
    case Language.PYTHON_THREE:
    case Language.PANDAS:
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
      return go();
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
      return elixir();
    case Language.DART:
      return StreamLanguage.define(dart);
    case Language.MY_SQL:
      return sql({ dialect: MySQL });
    case Language.MS_SQL_SERVER:
      return sql({ dialect: MSSQL });
    case Language.ORACLE:
      return sql({ dialect: PLSQL });
    case Language.POSTGRESQL:
      return sql({ dialect: PostgreSQL });
    case Language.BASH:
      return StreamLanguage.define(shell);
    case Language.ADA:
      break; // no support for now, can consider Pascal
    case Language.ALGOL_68:
      break; // no support for now
    case Language.APL:
      return StreamLanguage.define(apl);
    case Language.COBOL:
      return StreamLanguage.define(cobol);
    case Language.LISP:
      return StreamLanguage.define(commonLisp);
    case Language.CRYSTAL:
      return StreamLanguage.define(crystal);
    case Language.D:
      return StreamLanguage.define(d);
    case Language.F_SHARP:
      return StreamLanguage.define(fSharp);
    case Language.FORTRAN:
      return StreamLanguage.define(fortran);
    case Language.GERBIL:
      break; // no support for now, can consider Scheme
    case Language.HASKELL:
      return StreamLanguage.define(haskell);
    case Language.JULIA:
      return StreamLanguage.define(julia);
    case Language.LUA:
      return StreamLanguage.define(lua);
    case Language.MODULA_2:
      break; // no support for now
    case Language.NIM:
      break; // no support for now
    case Language.OBJECTIVE_C:
      return StreamLanguage.define(objectiveC);
    case Language.OCAML:
      return StreamLanguage.define(oCaml);
    case Language.OCTAVE:
      return StreamLanguage.define(octave);
    case Language.ODIN:
      break; // no support for now
    case Language.PASCAL:
      return StreamLanguage.define(pascal);
    case Language.PERL:
      return StreamLanguage.define(perl);
    case Language.PROLOG:
      return prolog();
    case Language.SIMULA_67:
      break; // no support for now
    case Language.SMALLTALK:
      return StreamLanguage.define(smalltalk);
    case Language.SNOBOL:
      break; // no support for now
    case Language.VISUAL_BASIC:
      return StreamLanguage.define(vb);
    case Language.ZIG:
      return zig();
  }
  return lezer();
};
