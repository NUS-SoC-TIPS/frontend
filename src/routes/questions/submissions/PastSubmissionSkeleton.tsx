import { ReactElement } from 'react';
import {
  Box,
  Button,
  Flex,
  Skeleton,
  Stack,
  StackDivider,
} from '@chakra-ui/react';

import { FormControl, FormControlSkeleton } from '@/components/formControl';

import { PastSubmissionPage } from './PastSubmissionPage';

export const PastSubmissionSkeleton = (): ReactElement<
  void,
  typeof PastSubmissionPage
> => {
  return (
    <PastSubmissionPage>
      <Stack divider={<StackDivider />} spacing={5}>
        <FormControlSkeleton id="name" label="Name" />
        <FormControlSkeleton id="url" label="URL" />
        <FormControlSkeleton id="difficulty" label="Difficulty" />
        <FormControlSkeleton id="language" label="Language Used" />
        <FormControl id="code" label="Code Written">
          <Skeleton>
            <Box height="15rem" width="100%" />
          </Skeleton>
        </FormControl>
        <Flex direction="row-reverse">
          <Stack direction="row" spacing={2}>
            <Button isDisabled={true} variant="secondary">
              Delete Submission
            </Button>
            <Button isDisabled={true} variant="primary">
              Update Submission
            </Button>
          </Stack>
        </Flex>
      </Stack>
    </PastSubmissionPage>
  );
};
