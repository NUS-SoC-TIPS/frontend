import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { WindowStatus } from 'types/models/window';

interface Props {
  windowStatus: WindowStatus;
  numCompleted: number;
  numTarget: number;
}

export const NumCompletedCard = ({
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
        <Text color="muted" fontSize="sm">
          {title}
        </Text>
        <Heading size="sm">{stat}</Heading>
      </Stack>
    </Card>
  );
};
