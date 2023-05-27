import { ReactElement } from 'react';
import { Heading, Skeleton, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';

export const StatCardSkeleton = (): ReactElement<typeof Card> => {
  return (
    <Card>
      <Stack>
        <Skeleton>
          <Text color="muted" fontSize="sm">
            Skeleton
          </Text>
        </Skeleton>
        <Stack spacing={4}>
          <Skeleton>
            <Heading size="sm">Skeleton</Heading>
          </Skeleton>
          <Skeleton>
            <Text color="muted" fontWeight="medium">
              Skeleton
            </Text>
          </Skeleton>
        </Stack>
      </Stack>
    </Card>
  );
};
