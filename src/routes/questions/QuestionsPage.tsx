import { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { ADD_QUESTION } from 'constants/routes';

export const QuestionsPage = ({
  children,
}: PropsWithChildren<unknown>): ReactElement<
  PropsWithChildren<unknown>,
  typeof Page
> => {
  const navigate = useNavigate();
  return (
    <Page>
      <Dashboard
        actions={
          <Button
            onClick={(): void => navigate(ADD_QUESTION)}
            variant="primary"
          >
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
