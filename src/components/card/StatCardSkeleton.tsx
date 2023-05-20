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
        <Skeleton>
          <Heading height={42}>Skeleton</Heading>
        </Skeleton>
      </Stack>
    </Card>
  );
};
