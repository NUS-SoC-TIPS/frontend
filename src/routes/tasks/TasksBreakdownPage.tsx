import { PropsWithChildren, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { TASKS } from 'constants/routes';

export const TasksBreakdownPage = ({
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
          <Button onClick={(): void => navigate(TASKS)} variant="primary">
            Back to Cohorts
          </Button>
        }
        heading="Tasks"
        subheading="Track your progress for this cohort here!"
      >
        {children}
      </Dashboard>
    </Page>
  );
};
