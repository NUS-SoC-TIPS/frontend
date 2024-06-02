import { ReactElement } from 'react';
import { Flex, Stack, StackDivider } from '@chakra-ui/layout';
import { Button } from '@chakra-ui/react';

import { StatCardSkeleton } from '@/components/card';
import { FormControlSkeleton } from '@/components/formControl';

import { ViewCohortPage } from './ViewCohortPage';

export const ViewCohortSkeleton = (): ReactElement<typeof ViewCohortPage> => {
  return (
    <ViewCohortPage>
      <Stack spacing={12}>
        <Stack divider={<StackDivider />} spacing={5}>
          <FormControlSkeleton id="name" label="Name" />
          <FormControlSkeleton id="url" label="URL" />
          <FormControlSkeleton id="email" label="Email" />
          <Flex direction="row-reverse">
            <Button isDisabled={true} variant="primary">
              Update Basic Info
            </Button>
          </Flex>
        </Stack>
        <StatCardSkeleton />
        <StatCardSkeleton />
      </Stack>
    </ViewCohortPage>
  );
};
