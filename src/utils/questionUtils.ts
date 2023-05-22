import { QuestionSource } from 'types/models/question';

export const getQuestionUrl = (question: {
  source: QuestionSource;
  slug: string;
}): string => {
  switch (question.source) {
    case QuestionSource.LEETCODE:
      return `leetcode.com/problems/${question.slug}`;
    case QuestionSource.KATTIS:
      return `open.kattis.com/problems/${question.slug}`;
    default:
      return '';
  }
};

export const getQuestionUrlWithHttps = (question: {
  source: QuestionSource;
  slug: string;
}): string => {
  return `https://${getQuestionUrl(question)}`;
};
