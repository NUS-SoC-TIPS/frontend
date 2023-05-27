import { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { QUESTIONS } from 'constants/routes';

interface Props {
  heading?: string;
  subheading?: string;
}

export const PastSubmissionPage = ({
  children,
  heading = 'Submission',
  subheading = 'Loading submission...',
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof Page
> => {
  const navigate = useNavigate();
  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={(): void => navigate(QUESTIONS)} variant="secondary">
            Back to Questions
          </Button>
        }
        heading={heading}
        subheading={subheading}
      >
        {children}
      </Dashboard>
    </Page>
  );
};
