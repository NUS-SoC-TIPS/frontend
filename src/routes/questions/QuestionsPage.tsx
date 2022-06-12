import { PropsWithChildren, ReactElement } from 'react';
import { Button } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';

interface Props {
  onAdd?: () => void;
}

export const QuestionsPage = ({
  onAdd,
  children,
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof Page
> => {
  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={onAdd} variant="primary">
            Add Question
          </Button>
        }
        heading="Questions"
        subheading="Add your questions here once you have completed them!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
