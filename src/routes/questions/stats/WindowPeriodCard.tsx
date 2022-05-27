import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from 'components/card';
import { WindowStatus } from 'types/models/window';
import { formatDate } from 'utils/dateUtils';

interface Props {
  windowStatus: WindowStatus;
  startAt: Date;
  endAt: Date;
}

export const WindowPeriodCard = ({
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
        <Text color="muted" fontSize="sm">
          {getTitle()}
        </Text>
        <Heading size="sm">
          {formatDate(startAt)} - {formatDate(endAt)}
        </Heading>
      </Stack>
    </Card>
  );
};
