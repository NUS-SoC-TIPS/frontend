import { ReactElement } from 'react';
import { Button } from '@chakra-ui/react';

import { Question } from 'types/models/question';

import { QuestionBox } from './QuestionBox';

interface Props {
  question: Question;
}

export const QuestionBoxButton = ({
  question,
}: Props): ReactElement<Props, typeof Button> => {
  return (
    <Button
      cursor="default"
      justifyContent="start"
      px={{ base: 3, md: 4 }}
      py={8}
      w={'100%'}
    >
      <QuestionBox question={question} withBox={false} />
    </Button>
  );
};
