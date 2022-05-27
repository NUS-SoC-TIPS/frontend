import { ReactElement } from 'react';
import { Heading, Skeleton, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';

export const SkeletonStatCard = (): ReactElement<typeof Card> => {
  return (
    <Card>
      <Stack>
        <Skeleton>
          <Text color="muted" fontSize="sm">
            Skeleton
          </Text>
        </Skeleton>
        <Skeleton>
          <Heading size="sm">Skeleton</Heading>
        </Skeleton>
      </Stack>
    </Card>
  );
};
