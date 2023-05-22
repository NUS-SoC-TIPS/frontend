import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, StackDivider } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { INTERVIEWS } from 'constants/routes';

export const PastInterviewSkeleton = (): ReactElement<void, typeof Page> => {
  const navigate = useNavigate();
  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={(): void => navigate(INTERVIEWS)} variant="primary">
            Back to Interviews
          </Button>
        }
        heading={'Interview'}
        subheading={'Loading submission...'}
      >
        <Stack divider={<StackDivider />} spacing={5}></Stack>
      </Dashboard>
    </Page>
  );
};
