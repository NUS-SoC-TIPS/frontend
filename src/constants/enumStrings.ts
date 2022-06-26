import { Language } from 'types/models/code';
import { QuestionDifficulty, QuestionSource } from 'types/models/question';

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

export const sourceToString = Object.freeze({
  [QuestionSource.LEETCODE]: 'LeetCode',
  [QuestionSource.HACKERRANK]: 'HackerRank',
  [QuestionSource.KATTIS]: 'Kattis',
  [QuestionSource.CUSTOM]: 'Custom',
});
