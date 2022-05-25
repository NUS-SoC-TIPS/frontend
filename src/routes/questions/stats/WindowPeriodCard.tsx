import { ReactElement } from 'react';
import { Heading, Skeleton, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { WindowStatus } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

interface Props {
  isLoaded: boolean;
  windowStatus: WindowStatus;
  startAt: Date;
  endAt: Date;
}

export const WindowPeriodCard = ({
  isLoaded,
  windowStatus,
  startAt,
  endAt,
}: Props): ReactElement<typeof Card> => {
  const getTitle = (): string => {
    switch (windowStatus) {
      case WindowStatus.ONGOING:
        return 'Current Window';
      case WindowStatus.UPCOMING:
        return 'Upcoming Window';
      case WindowStatus.OVER:
        return 'Last Window';
    }
  };

  return (
    <Card>
      <Stack>
        <Skeleton isLoaded={isLoaded}>
          <Text color="muted" fontSize="sm">
            {getTitle()}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={isLoaded}>
          <Heading size="sm">
            {formatDate(startAt)} - {formatDate(endAt)}
          </Heading>
        </Skeleton>
      </Stack>
    </Card>
  );
};
