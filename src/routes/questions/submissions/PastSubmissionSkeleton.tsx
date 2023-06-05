import { ReactElement } from 'react';
import { Stack, StackDivider } from '@chakra-ui/react';

import { emptyFunction } from 'utils/functionUtils';

import { NameFormControl } from '../components/form';

import { PastSubmissionPage } from './PastSubmissionPage';

export const PastSubmissionSkeleton = (): ReactElement<
  void,
  typeof PastSubmissionPage
> => {
  return (
    <PastSubmissionPage>
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
    </PastSubmissionPage>
  );
};