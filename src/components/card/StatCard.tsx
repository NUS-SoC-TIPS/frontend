import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from './Card';

interface Props {
  title: string | number;
  stat: string | number;
}

export const StatCard = ({
  title,
  stat,
}: Props): ReactElement<Props, typeof Card> => {
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
