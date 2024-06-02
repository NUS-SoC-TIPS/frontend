import { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Dashboard, Page } from '@/components/page';
import { INTERVIEWS } from '@/constants/routes';

interface Props {
  heading?: string;
  subheading?: string;
}

export const PastInterviewPage = ({
  heading = 'Interview',
  subheading = 'Loading record...',
  children,
}: PropsWithChildren<Props>): ReactElement<
  PropsWithChildren<Props>,
  typeof Page
> => {
  const navigate = useNavigate();

  return (
    <Page>
      <Dashboard
        actions={
          <Button
            onClick={(): void => navigate(INTERVIEWS)}
            variant="secondary"
          >
            Back to Interviews
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
