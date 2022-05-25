import { ReactElement } from 'react';
import { Heading, Skeleton, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { WindowStatus } from 'types/models/window';

interface Props {
  isLoaded: boolean;
  windowStatus: WindowStatus;
  numCompleted: number;
  numTarget: number;
}

export const NumCompletedCard = ({
  isLoaded,
  windowStatus,
  numCompleted,
  numTarget,
}: Props): ReactElement<Props, typeof Card> => {
  const isOngoing = windowStatus === WindowStatus.ONGOING;
  const title = isOngoing ? 'Completed This Window' : 'Completed This Week';
  const stat = `${numCompleted}${isOngoing ? `/${numTarget}` : ''} questions`;

  return (
    <Card>
      <Stack>
        <Skeleton isLoaded={isLoaded}>
          <Text color="muted" fontSize="sm">
            {title}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>
          <Heading size="sm">{stat}</Heading>
        </Skeleton>
      </Stack>
    </Card>
  );
};
