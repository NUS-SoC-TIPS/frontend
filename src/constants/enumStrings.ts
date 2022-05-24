import { Language } from 'types/models/code';
import { QuestionDifficulty } from 'types/models/question';

export const languageToMode = Object.freeze({
  [Language.C_PLUS_PLUS]: 'c_cpp',
  [Language.JAVA]: 'java',
  [Language.PYTHON]: 'python',
  [Language.PYTHON_THREE]: 'python',
  [Language.C]: 'c_cpp',
  [Language.C_SHARP]: 'csharp',
  [Language.JAVASCRIPT]: 'javascript',
  [Language.RUBY]: 'ruby',
  [Language.SWIFT]: 'swift',
  [Language.GO]: 'golang',
  [Language.SCALA]: 'scala',
  [Language.KOTLIN]: 'kotlin',
  [Language.RUST]: 'rust',
  [Language.PHP]: 'php',
  [Language.TYPESCRIPT]: 'typescript',
  [Language.RACKET]: 'scheme',
  [Language.ERLANG]: 'erlang',
  [Language.ELIXIR]: 'elixir',
  [Language.BASH]: 'sh',
  [Language.MY_SQL]: 'mysql',
  [Language.MS_SQL_SERVER]: 'sqlserver',
  [Language.ORACLE]: 'sql',
});

export const languageToString = Object.freeze({
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
  [Language.BASH]: 'Bash',
  [Language.MY_SQL]: 'MySQL',
  [Language.MS_SQL_SERVER]: 'MS SQL Server',
  [Language.ORACLE]: 'Oracle',
});

export const difficultyToString = Object.freeze({
  [QuestionDifficulty.EASY]: 'Easy',
  [QuestionDifficulty.MEDIUM]: 'Medium',
  [QuestionDifficulty.HARD]: 'Hard',
});
