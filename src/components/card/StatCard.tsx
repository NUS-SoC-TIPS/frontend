import { ReactElement } from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

import { Card } from './Card';

interface Props {
  title: string | number;
  stat: string | number;
  subtitle: string | number;
}

export const StatCard = ({
  title,
  stat,
  subtitle,
}: Props): ReactElement<Props, typeof Card> => {
  return (
    <Card>
      <Stack>
        <Text color="muted" fontSize="sm">
          {title}
        </Text>
        <Stack spacing={4}>
          <Heading size="sm">{stat}</Heading>
          <Text color="muted" fontWeight="medium">
            {subtitle}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
};
