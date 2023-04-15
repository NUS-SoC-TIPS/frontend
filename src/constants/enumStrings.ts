import { KeyBinding, Language } from 'types/models/code';
import { QuestionDifficulty, QuestionSource } from 'types/models/question';

export const LANGUAGE_TO_STRING = Object.freeze({
  [Language.C_PLUS_PLUS]: 'C++',
  [Language.JAVA]: 'Java',
  [Language.PYTHON]: 'Python',
  [Language.PYTHON_THREE]: 'Python 3',
  [Language.C]: 'C',
  [Language.C_SHARP]: 'C#',
  [Language.JAVASCRIPT]: 'JavaScript',
  [Language.RUBY]: 'Ruby',
  [Language.SWIFT]: 'Swift',
  [Language.GO]: 'Go',
  [Language.SCALA]: 'Scala',
  [Language.KOTLIN]: 'Kotlin',
  [Language.RUST]: 'Rust',
  [Language.PHP]: 'PHP',
  [Language.TYPESCRIPT]: 'TypeScript',
  [Language.RACKET]: 'Racket',
  [Language.ERLANG]: 'Erlang',
  [Language.ELIXIR]: 'Elixir',
  [Language.DART]: 'Dart',
  [Language.MY_SQL]: 'MySQL',
  [Language.MS_SQL_SERVER]: 'MS SQL Server',
  [Language.ORACLE]: 'Oracle',
  [Language.BASH]: 'Bash',
  [Language.APL]: 'APL',
  [Language.COBOL]: 'COBOL',
  [Language.LISP]: 'Lisp',
  [Language.F_SHARP]: 'F#',
  [Language.FORTRAN]: 'Fortran',
  [Language.GERBIL]: 'Gerbil',
  [Language.HASKELL]: 'Haskell',
  [Language.JULIA]: 'Julia',
  [Language.OBJECTIVE_C]: 'Objective-C',
  [Language.OCAML]: 'OCaml',
  [Language.PASCAL]: 'Pascal',
  [Language.PROLOG]: 'Prolog',
});

export const KEY_BINDING_TO_STRING = Object.freeze({
  [KeyBinding.STANDARD]: 'Standard',
  [KeyBinding.VIM]: 'Vim',
  [KeyBinding.VS_CODE]: 'VSCode',
});

export const DIFFICULTY_TO_STRING = Object.freeze({
  [QuestionDifficulty.EASY]: 'Easy',
  [QuestionDifficulty.MEDIUM]: 'Medium',
  [QuestionDifficulty.HARD]: 'Hard',
});

export const SOURCE_TO_STRING = Object.freeze({
  [QuestionSource.LEETCODE]: 'LeetCode',
  [QuestionSource.HACKERRANK]: 'HackerRank',
  [QuestionSource.KATTIS]: 'Kattis',
  [QuestionSource.CUSTOM]: 'Custom',
});
