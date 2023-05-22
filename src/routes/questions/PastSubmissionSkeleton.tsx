import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, StackDivider } from '@chakra-ui/react';

import { Dashboard, Page } from 'components/page';
import { QUESTIONS } from 'constants/routes';
import { emptyFunction } from 'utils/functionUtils';

import { NameFormControl } from './form';

export const PastSubmissionSkeleton = (): ReactElement<void, typeof Page> => {
  const navigate = useNavigate();
  return (
    <Page>
      <Dashboard
        actions={
          <Button onClick={(): void => navigate(QUESTIONS)} variant="primary">
            Back to Questions
          </Button>
        }
        heading={'Submission'}
        subheading={'Loading submission...'}
      >
        <Stack divider={<StackDivider />} spacing={5}>
          <NameFormControl
            isDisabled={true}
            isError={false}
            isLoading={true}
            onChange={emptyFunction}
            questions={[]}
            selectedQuestion={null}
          />
        </Stack>
      </Dashboard>
    </Page>
  );
};
